import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  users: User[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id) {
        this.task = null;
        this.loading = false;
        this.errorMessage = 'ID task không hợp lệ.';
        this.cdr.detectChanges();
        return;
      }

      this.loadTaskDetail(id);
    });

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load users error:', err);
        this.users = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadTaskDetail(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.task = null;
    this.cdr.detectChanges();

    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load task detail error:', err);
        this.errorMessage = 'Không tải được chi tiết task.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get assignedUserName(): string {
    if (!this.task) return '';
    if (this.task.user?.name) return this.task.user.name;

    const user = this.users.find(u => u.id === this.task?.userId);
    return user?.name ?? 'Chưa gán';
  }
}