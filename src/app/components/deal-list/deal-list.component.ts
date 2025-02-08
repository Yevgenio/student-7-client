import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // for functions such as ngFor
import { DealService } from '../../services/deal.service';
import { Deal } from '../../models/deal.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-memo-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css']
})
export class DealListComponent implements OnInit {
  deals: Deal[] = [];

  constructor(public authService: AuthService, private dealService: DealService, private router: Router) { }

  ngOnInit(): void {
    this.dealService.getDeals().subscribe((data) => {
      this.deals = data;
      this.deals.forEach(deal => {
        deal.name = deal.name?.substring(0, 30);
        deal.description = deal.description?.substring(0, 30);
      });
    });
  }

  isLoggedIn(): void {
    this.authService.isLoggedIn();
  }

  editDeal(deal: any) {
    this.router.navigate(['/deals/edit/', deal._id]);
    console.log('Editing deal:', deal);
  }

  removeDeal(deal: any) {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.dealService.deleteDeal(deal._id).subscribe(() => {
        this.deals = this.deals.filter(d => d._id !== deal._id);
      });
    }
  }
}
// export class DealListComponent {
  
// }