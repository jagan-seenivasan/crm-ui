import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css']
})
export class StagesComponent implements OnInit {
  stages: any[] = [];
  editId = '';
  error = '';

  form = this.fb.group({
    name: ['', [Validators.required]],
    order: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getStages().subscribe((res) => {
      this.stages = res;
    });
  }

  startEdit(stage: any): void {
    this.editId = stage._id;
    this.form.patchValue({ name: stage.name, order: stage.order });
  }

  reset(): void {
    this.editId = '';
    this.form.patchValue({ name: '', order: 1 });
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
        this.error = err?.error?.message || 'Unable to save stage';
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
