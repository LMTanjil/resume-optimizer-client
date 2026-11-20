import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import AuthCard from "../components/common/AuthCard"
import Button from "../components/ui/Button"
import FormField from "../components/ui/FormField"
import Input from "../components/ui/Input"
import { LIMITS } from "../constants"
import { useAuth } from "../hooks/useAuth"
import { useGreeting } from "../hooks/useGreeting"
import { usePageTitle } from "../hooks/usePageTitle"
import { register as registerRequest } from "../services/api"
import { getErrorMessage } from "../utils/apiError"
import { getDisplayName } from "../utils/user"
import { validateRegister } from "../utils/validation"

const FIELDS = [
  {
    key: "name",
    label: "Name",
    type: "text",
    autoComplete: "name",
    placeholder: "Your full name",
    maxLength: LIMITS.userName,
  },
  { key: "email", label: "Email", type: "email", autoComplete: "email", maxLength: LIMITS.email },
  { key: "password", label: "Password", type: "password", autoComplete: "new-password" },
  {
    key: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
  },
]

export default function Register() {
  usePageTitle("Register")
  const { login } = useAuth()
  const greet = useGreeting()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (field) => (event) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    if (submitted) setErrors(validateRegister(next))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (loading) return
    setSubmitted(true)
    const nextErrors = validateRegister(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      formRef.current?.querySelector("[aria-invalid='true']")?.focus()
      return
    }

    setLoading(true)
    try {
      const { data } = await registerRequest(
        values.name.trim(),
        values.email.trim(),
        values.password
      )
      login(data.token, data.user)
      toast.success(greet("register", getDisplayName(data.user)))
      navigate("/dashboard", { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Build, tailor and analyze your resumes."
      footerText="Already have an account?"
      footerLink="Log in"
      footerTo="/login"
    >
      <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        {FIELDS.map(({ key, label, type, autoComplete, placeholder, maxLength }) => (
          <FormField key={key} id={key} label={label} required error={errors[key]}>
            {(field) => (
              <Input
                {...field}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                maxLength={maxLength}
                value={values[key]}
                onChange={onChange(key)}
              />
            )}
          </FormField>
        ))}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          loadingText="Creating account…"
          className="mt-2 w-full"
        >
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
