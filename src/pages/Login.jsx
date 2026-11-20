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
import { login as loginRequest } from "../services/api"
import { getErrorMessage } from "../utils/apiError"
import { getDisplayName } from "../utils/user"
import { validateLogin } from "../utils/validation"

export default function Login() {
  usePageTitle("Log in")
  const { login } = useAuth()
  const greet = useGreeting()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [values, setValues] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (field) => (event) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    if (submitted) setErrors(validateLogin(next))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (loading) return
    setSubmitted(true)
    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      formRef.current?.querySelector("[aria-invalid='true']")?.focus()
      return
    }

    setLoading(true)
    try {
      const { data } = await loginRequest(values.email.trim(), values.password)
      login(data.token, data.user)
      toast.success(greet("login", getDisplayName(data.user)))
      navigate("/dashboard", { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Log in to ResumeAI"
      subtitle="Welcome back. Let's get you to your resumes."
      footerText="Don't have an account?"
      footerLink="Register"
      footerTo="/register"
    >
      <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField id="email" label="Email" required error={errors.email}>
          {(field) => (
            <Input
              {...field}
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              value={values.email}
              onChange={onChange("email")}
            />
          )}
        </FormField>
        <FormField id="password" label="Password" required error={errors.password}>
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={onChange("password")}
            />
          )}
        </FormField>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          loadingText="Logging in…"
          className="mt-2 w-full"
        >
          Log in
        </Button>
      </form>
    </AuthCard>
  )
}
