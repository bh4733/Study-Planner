import { useState } from "react";
import formfield from "../forms/formfield";
import alert from "../ui/alert";
import { formatDateForInput, todayISO } from "../../utils/dates";
import { priorities, status } from "../../utils/status";

const toFormValues = (task) => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  module: task?.module ?? "",
  description: task?.description ?? "",
  priority: task?.priority ?? "medium",
  status: task?.status ?? "not-started",
  deadline: formatDateForInput(task?.deadline) ?? todayISO(),
});

const validateForm = (values) => {
  const errors = {};
  const today = todayISO();
  if (!values.title) errors.title = "Title is required";
  if (!values.module) errors.module = "Module is required";
  if (!values.deadline) errors.deadline = "Deadline is required";
  return errors;
};
export default function TaskForm({
  task = null,
  onSubmit,
  onCancel,
  submitLabel = "Save task",
}) {
  const [values, setValues] = useState(() => toFormValues(task));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const originalDeadline = task?.deadline ?? null;
  // Let the date picker show an existing overdue deadline without flagging it
  const minDate =
    originalDeadline && originalDeadline < todayISO()
      ? originalDeadline
      : todayISO();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values, originalDeadline);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;

    const data = {
      title: values.title.trim(),
      module: values.module.trim(),
      description: values.description.trim(),
      deadline: values.deadline,
      priority: values.priority,
      status: values.status,
      estimatedHours:
        values.estimatedHours === "" ? 0 : Number(values.estimatedHours),
    };

    setSubmitting(true);
    try {
      await onSubmit(data);
      // No setSubmitting(false) here: the page navigates away on success
    } catch (err) {
      if (err.details)
        setErrors(err.details); // per-field errors from the server
      else setFormError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <Alert>{formError}</Alert>

      <FormField
        label="Title"
        name="title"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        maxLength={100}
        autoFocus
        required
      />

      <FormField
        label="Module"
        name="module"
        value={values.module}
        onChange={handleChange}
        error={errors.module}
        maxLength={50}
        hint="Leave blank to file it under General."
      />

      <FormField
        as="textarea"
        label="Description"
        name="description"
        rows={4}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        maxLength={1000}
      />

      <div className="form-row">
        <FormField
          label="Deadline"
          name="deadline"
          type="date"
          value={values.deadline}
          onChange={handleChange}
          error={errors.deadline}
          min={minDate}
          required
        />

        <FormField
          label="Estimated hours"
          name="estimatedHours"
          type="number"
          min={0}
          max={1000}
          step={0.5}
          inputMode="decimal"
          value={values.estimatedHours}
          onChange={handleChange}
          error={errors.estimatedHours}
        />
      </div>

      <div className="form-row">
        <FormField
          as="select"
          label="Priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
          error={errors.priority}
        >
          {priority.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FormField>

        <FormField
          as="select"
          label="Status"
          name="status"
          value={values.status}
          onChange={handleChange}
          error={errors.status}
        >
          {status.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FormField>
      </div>

      <div className="form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
