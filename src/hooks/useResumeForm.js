import { useCallback, useMemo, useReducer } from "react"
import {
  emptyBullet,
  emptyEducation,
  emptyExperience,
  emptyProject,
  snapshot,
  toPayload,
} from "../utils/resumeData"
import { findFirstInvalidStep, validateStep } from "../utils/validation"

// Builder form state via useReducer (docs/state-management.md §5).

const FACTORIES = {
  experience: emptyExperience,
  education: emptyEducation,
  projects: emptyProject,
}

function init({ initialData, dirtyFromStart }) {
  return {
    data: initialData,
    initialSnapshot: snapshot(initialData),
    dirtyFromStart,
    errors: {},
  }
}

// Removes errors whose key starts with `prefix` (used when an item or field changes).
function dropErrors(errors, prefix) {
  const next = {}
  Object.entries(errors).forEach(([key, value]) => {
    if (key !== prefix && !key.startsWith(`${prefix}.`)) next[key] = value
  })
  return next
}

function updateContent(state, updater) {
  return { ...state, data: { ...state.data, content: updater(state.data.content) } }
}

function updateItem(state, section, itemId, updater) {
  return updateContent(state, (content) => ({
    ...content,
    [section]: content[section].map((item) => (item.id === itemId ? updater(item) : item)),
  }))
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        data: { ...state.data, title: action.value },
        errors: dropErrors(state.errors, "title"),
      }
    case "SET_SUMMARY":
      return updateContent(state, (content) => ({ ...content, summary: action.value }))
    case "SET_CONTACT": {
      const next = updateContent(state, (content) => ({
        ...content,
        contact: { ...content.contact, [action.field]: action.value },
      }))
      return { ...next, errors: dropErrors(state.errors, `contact.${action.field}`) }
    }
    case "ADD_ITEM":
      return updateContent(state, (content) => ({
        ...content,
        [action.section]: [...content[action.section], action.item],
      }))
    case "REMOVE_ITEM": {
      const next = updateContent(state, (content) => ({
        ...content,
        [action.section]: content[action.section].filter((item) => item.id !== action.itemId),
      }))
      return { ...next, errors: dropErrors(state.errors, `${action.section}.${action.itemId}`) }
    }
    case "SET_ITEM_FIELD": {
      const next = updateItem(state, action.section, action.itemId, (item) => ({
        ...item,
        [action.field]: action.value,
      }))
      return {
        ...next,
        errors: dropErrors(state.errors, `${action.section}.${action.itemId}.${action.field}`),
      }
    }
    case "ADD_BULLET":
      return updateItem(state, "experience", action.itemId, (item) => ({
        ...item,
        bullets: [...item.bullets, action.bullet],
      }))
    case "UPDATE_BULLET":
      return updateItem(state, "experience", action.itemId, (item) => ({
        ...item,
        bullets: item.bullets.map((b) =>
          b.id === action.bulletId ? { ...b, text: action.text } : b
        ),
      }))
    case "REMOVE_BULLET":
      return updateItem(state, "experience", action.itemId, (item) => ({
        ...item,
        bullets: item.bullets.filter((b) => b.id !== action.bulletId),
      }))
    case "ADD_SKILL":
      return updateContent(state, (content) => ({
        ...content,
        skills: [...content.skills, action.tag],
      }))
    case "REMOVE_SKILL":
      return updateContent(state, (content) => ({
        ...content,
        skills: content.skills.filter((_, i) => i !== action.index),
      }))
    case "ADD_TECH": {
      const next = updateItem(state, "projects", action.itemId, (item) => ({
        ...item,
        tech: [...item.tech, action.tag],
      }))
      return { ...next, errors: dropErrors(state.errors, `projects.${action.itemId}.tech`) }
    }
    case "REMOVE_TECH":
      return updateItem(state, "projects", action.itemId, (item) => ({
        ...item,
        tech: item.tech.filter((_, i) => i !== action.index),
      }))
    case "SET_ERRORS":
      return { ...state, errors: action.errors }
    case "RESET":
      return init({ initialData: action.data, dirtyFromStart: action.dirtyFromStart ?? false })
    case "MARK_SAVED":
      return { ...state, initialSnapshot: snapshot(state.data), dirtyFromStart: false }
    default:
      return state
  }
}

export function useResumeForm(initialData, { dirtyFromStart = false } = {}) {
  const [state, dispatch] = useReducer(reducer, { initialData, dirtyFromStart }, init)
  const { data, errors } = state

  const isDirty = useMemo(
    () => state.dirtyFromStart || snapshot(data) !== state.initialSnapshot,
    [state.dirtyFromStart, state.initialSnapshot, data]
  )

  const actions = useMemo(
    () => ({
      setTitle: (value) => dispatch({ type: "SET_TITLE", value }),
      setSummary: (value) => dispatch({ type: "SET_SUMMARY", value }),
      setContact: (field, value) => dispatch({ type: "SET_CONTACT", field, value }),
      addItem: (section) => {
        const item = FACTORIES[section]()
        dispatch({ type: "ADD_ITEM", section, item })
        return item.id
      },
      removeItem: (section, itemId) => dispatch({ type: "REMOVE_ITEM", section, itemId }),
      setItemField: (section, itemId, field, value) =>
        dispatch({ type: "SET_ITEM_FIELD", section, itemId, field, value }),
      addBullet: (itemId) => {
        const bullet = emptyBullet()
        dispatch({ type: "ADD_BULLET", itemId, bullet })
        return bullet.id
      },
      updateBullet: (itemId, bulletId, text) =>
        dispatch({ type: "UPDATE_BULLET", itemId, bulletId, text }),
      removeBullet: (itemId, bulletId) => dispatch({ type: "REMOVE_BULLET", itemId, bulletId }),
      addSkill: (tag) => dispatch({ type: "ADD_SKILL", tag }),
      removeSkill: (index) => dispatch({ type: "REMOVE_SKILL", index }),
      addTech: (itemId, tag) => dispatch({ type: "ADD_TECH", itemId, tag }),
      removeTech: (itemId, index) => dispatch({ type: "REMOVE_TECH", itemId, index }),
      reset: (nextData, options = {}) =>
        dispatch({ type: "RESET", data: nextData, dirtyFromStart: options.dirtyFromStart }),
      markSaved: () => dispatch({ type: "MARK_SAVED" }),
      setErrors: (nextErrors) => dispatch({ type: "SET_ERRORS", errors: nextErrors }),
    }),
    []
  )

  // Validates one step and shows its errors. Returns true when valid.
  const validateCurrentStep = useCallback(
    (step) => {
      const stepErrors = validateStep(step, data)
      dispatch({ type: "SET_ERRORS", errors: stepErrors })
      return Object.keys(stepErrors).length === 0
    },
    [data]
  )

  // Returns the first invalid step (and shows its errors) or null when everything is valid.
  const validateAll = useCallback(() => {
    const firstInvalid = findFirstInvalidStep(data)
    dispatch({
      type: "SET_ERRORS",
      errors: firstInvalid ? validateStep(firstInvalid, data) : {},
    })
    return firstInvalid
  }, [data])

  const getPayload = useCallback(() => toPayload(data), [data])

  return { data, errors, isDirty, ...actions, validateCurrentStep, validateAll, getPayload }
}
