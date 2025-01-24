import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
// import { CommonModule } from '@angular/common';
import { DealService } from '../../services/deal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './deal-form.component.html',
  styleUrls: ['./deal-form.component.css']
})
export class DealFormComponent implements OnInit {
  dealForm!: FormGroup;
  selectedFiles: { [key: string]: File } = {};
  isEditMode = false; // To track whether we're editing or creating a deal
  dealId: string | null = null; // To store the ID of the deal being edited
  existingBarcodePath: string | undefined;
  existingImagePath: string | undefined;

  constructor(
    private fb: FormBuilder,
    private dealService: DealService,
    private route: ActivatedRoute, // To fetch route parameters
    private router: Router // To navigate after submission
  ) {}

  ngOnInit(): void {
    this.dealForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      stock: [null],
      startsAt: [''],
      endsAt: [''],
      imagePath: [''],
      barcodePath: [''],
    });
  
    const dealId = this.route.snapshot.paramMap.get('id');
    if (dealId) {
      this.isEditMode = true;
      this.dealId = dealId;
  
      // Fetch the existing deal data
      this.dealService.getDealById(dealId).subscribe(deal => {
        this.dealForm.patchValue({
          name: deal.name,
          description: deal.description,
          category: deal.category,
          stock: deal.stock,
          startsAt: deal.startsAt ? new Date(deal.startsAt).toISOString().substring(0, 10) : '',
          endsAt: deal.endsAt ? new Date(deal.endsAt).toISOString().substring(0, 10) : '',
        });
  
        // Store existing image and barcode paths
        this.existingImagePath = deal.imagePath;
        this.existingBarcodePath = deal.barcodePath;
      });
    }
  }

  onFileSelect(event: Event, field: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.dealForm.patchValue({ [field]: file });
      this.dealForm.get(field)?.updateValueAndValidity();
    }
  }


  onSubmit(): void {
    if (this.dealForm.valid) {
      const formData = new FormData();
  
      // Append form fields
      Object.keys(this.dealForm.value).forEach(key => {
        formData.append(key, this.dealForm.value[key]);
      });
  
      // Use existing image and barcode paths if new files are not uploaded
      if (!this.selectedFiles['imagePath']) {
        formData.append('imagePath', this.existingImagePath || '');
      }
      if (!this.selectedFiles['barcodePath']) {
        formData.append('barcodePath', this.existingBarcodePath || '');
      }
  
      // Append new files, if any
      Object.keys(this.selectedFiles).forEach(key => {
        formData.append(key, this.selectedFiles[key]);
      });
  
      if (this.isEditMode) {
        // Update the deal
        this.dealService.updateDeal(this.dealId!, formData).subscribe({
          next: () => {
            alert('Deal updated successfully!');
            this.router.navigate(['/deals']);
          },
          error: err => {
            console.error('Error updating deal:', err);
          },
        });
      }
    }
  }
}
