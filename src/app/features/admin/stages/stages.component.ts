import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { applyServerValidationErrors } from '../../../core/utils/form-error.util';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css']
})
export class StagesComponent implements OnInit {
  stages: any[] = [];
  editId = '';
  error = '';
  selectedType: 'LEAD' | 'OPPORTUNITY' = 'LEAD';

  form = this.fb.group({
    type: ['LEAD', [Validators.required]],
    name: ['', [Validators.required]],
    order: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getStages(this.selectedType).subscribe((res) => {
      this.stages = res;
    });
  }

  switchType(type: 'LEAD' | 'OPPORTUNITY'): void {
    this.selectedType = type;
    if (!this.editId) {
      this.form.patchValue({ type });
    }
    this.load();
  }

  startEdit(stage: any): void {
    this.editId = stage._id;
    this.form.patchValue({ type: stage.type || 'LEAD', name: stage.name, order: stage.order });
  }

  reset(): void {
    this.editId = '';
    this.form.patchValue({ type: this.selectedType, name: '', order: 1 });
    this.form.markAsPristine();
    this.error = '';
  }

  save(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const action = this.editId
      ? this.api.updateStage(this.editId, this.form.getRawValue())
      : this.api.createStage(this.form.getRawValue());

    action.subscribe({
      next: () => {
        this.reset();
        this.load();
      },
      error: (err) => {
        this.error = applyServerValidationErrors(this.form, err);
      }
    });
  }

  remove(stage: any): void {
    this.error = '';
    this.api.deleteStage(stage._id).subscribe({
      next: () => this.load(),
      error: () => {
        this.error = 'Delete stage endpoint is not available on this backend yet.';
      }
    });
  }
}
