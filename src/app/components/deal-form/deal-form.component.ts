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

    // Check if we're in edit mode (i.e., if a deal ID is in the route)
    this.dealId = this.route.snapshot.paramMap.get('id');
    if (this.dealId) {
      this.isEditMode = true;
      // Fetch the deal details and populate the form
      this.dealService.getDealById(this.dealId).subscribe(deal => {
        deal.stock = deal.stock == null ? -1 : deal.stock;
        this.dealForm.patchValue(deal);
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
