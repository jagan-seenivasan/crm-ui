import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  templateUrl: './lead-import.component.html',
  styleUrls: ['./lead-import.component.css']
})
export class LeadImportComponent implements OnInit {
  file: File | null = null;
  headers: string[] = [];
  sampleRows: any[] = [];
  users: any[] = [];
  stages: any[] = [];
  error = '';

  mapping: any = {
    title: '',
    email: '',
    phone: '',
    company: '',
    value: '',
    stageId: '',
    ownerId: ''
  };

  defaults: any = {
    stageId: '',
    ownerId: ''
  };

  previewSummary: any = null;
  previewRows: any[] = [];
  importSummary: any = null;
  importErrors: any[] = [];
  importedRows: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe((res) => (this.users = res));
    this.api.getStages('LEAD').subscribe((res) => (this.stages = res));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] || null;
  }

  uploadAndDetectHeaders(): void {
    this.error = '';
    if (!this.file) {
      this.error = 'Choose a CSV file first';
      return;
    }
    this.api.importLeadsCsv(this.file, { dryRun: true }).subscribe({
      next: (res) => {
        this.headers = res.headers || [];
        this.sampleRows = res.sampleRows || [];
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to parse CSV';
      }
    });
  }

  previewImport(): void {
    this.error = '';
    this.previewSummary = null;
    if (!this.file) {
      this.error = 'Choose a CSV file first';
      return;
    }
    this.api
      .importLeadsCsv(this.file, {
        dryRun: true,
        mapping: this.mapping,
        defaults: this.defaults
      })
      .subscribe({
        next: (res) => {
          this.previewSummary = res.summary || null;
          this.previewRows = res.previewRows || [];
        },
        error: (err) => {
          this.error = err?.error?.message || 'Preview failed';
        }
      });
  }

  runImport(): void {
    this.error = '';
    this.importSummary = null;
    this.importErrors = [];
    this.importedRows = [];
    if (!this.file) {
      this.error = 'Choose a CSV file first';
      return;
    }
    this.api
      .importLeadsCsv(this.file, {
        dryRun: false,
        mapping: this.mapping,
        defaults: this.defaults
      })
      .subscribe({
        next: (res) => {
          this.importSummary = res.summary || null;
          this.importErrors = res.errors || [];
          this.importedRows = res.imported || [];
        },
        error: (err) => {
          this.error = err?.error?.message || 'Import failed';
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }
}
