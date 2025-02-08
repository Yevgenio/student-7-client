import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
// import { CommonModule } from '@angular/common';
import { DealService } from '../../services/deal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-memo-form',
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
      stock: -1,
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
      // Prepare the payload
      const dealData = { ...this.dealForm.value };
  
      // Convert empty strings to null
      Object.keys(dealData).forEach((key) => {
        if (dealData[key] === '') {
          dealData[key] = null;
        }
      });
      if (this.isEditMode) {
        // Update the existing deal
        this.dealService.updateDeal(this.dealId!, this.dealForm.value).subscribe(() => {
          this.router.navigate(['/deals']);
        });
      } else {
        // Create a new deal
        this.dealService.createDeal(this.dealForm.value).subscribe(() => {
          this.router.navigate(['/deals']);
        });
      }
    }
  }
}
