export default function FormField({
  label,
  name,
  error,
  hint,
  as: Control = "input",
  children,
  ...controlProps
}) {
  const id = `field-${name}`;
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <Control
        id={id}
        name={name}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        {...controlProps}
      >
        {children}
      </Control>
      {hint && (
        <p id={`${id}-hint`} className="form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
