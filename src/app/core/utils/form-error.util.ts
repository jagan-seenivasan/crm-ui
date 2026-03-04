import { AbstractControl, FormGroup } from '@angular/forms';

function resolveControl(form: FormGroup, fieldPath: string): AbstractControl | null {
  if (!fieldPath) return null;
  if (form.get(fieldPath)) return form.get(fieldPath);
  const shortKey = fieldPath.split('.').pop() || fieldPath;
  return form.get(shortKey);
}

export function applyServerValidationErrors(form: FormGroup, err: any): string {
  const details = err?.error?.error?.details;
  if (!Array.isArray(details) || !details.length) {
    return err?.error?.message || 'Request failed';
  }

  let unmatchedMessages: string[] = [];

  details.forEach((item: any) => {
    const control = resolveControl(form, item?.field || '');
    const message = item?.message || 'Invalid value';
    if (!control) {
      unmatchedMessages.push(message);
      return;
    }

    const existing = control.errors || {};
    control.setErrors({
      ...existing,
      server: message
    });
    control.markAsTouched();
  });

  if (unmatchedMessages.length) {
    return unmatchedMessages.join(', ');
  }

  return err?.error?.message || 'Validation failed';
}
