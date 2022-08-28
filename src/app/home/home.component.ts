import { Component, OnInit , ViewChild , ChangeDetectorRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit  {
  employeeForm: FormGroup;
  searchForm: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'department', 'salary' , 'action'];
  @ViewChild(MatPaginator , {static: true}) paginator: MatPaginator;
  dataSource:any;
  addForm:boolean = false;
  submitted:boolean = false;
  addEmployeeData = [];
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  editId:boolean = false;
  editedIndexValue:any;
  countIndex:number = 0;
  dummyFilteredData:any;

  Departments = [
    {
      id: '1',
      name: 'BackEnd'
    },
     {
      id: '2',
      name: 'FrontEnd'
    }
  ]


  constructor(
    private fb : FormBuilder,
    private ref:ChangeDetectorRef
  ) { 
    this.employeeForm =  this.fb.group({
      name: ['' , [Validators.required]],
      department: ['' , [Validators.required]],
      salary: ['' , [Validators.required]]
    })

     this.searchForm =  this.fb.group({
      salaryAmount: [''],
      departmentWiseData: ['']
    })
  }

  ngOnInit() {
    this.getEmployeesDetails();
  }

  // This function is used for get the employee details
  getEmployeesDetails() {
    this.dataSource = this.addEmployeeData;
    this.dataSource.paginator = this.paginator;
    this.totalSize = this.addEmployeeData.length;
    this.ref.detectChanges();
  }

  // This function is used for open the employee forms
  openEmployeesForm() {
    this.addForm = !this.addForm;
    this.editId = false;
    this.employeeForm.reset();
    this.submitted = false;
  }

  // add employeeform dataSource
  addEmployeesForm() {
    this.submitted = true;
    if(this.employeeForm.valid) {
      let request = {...this.employeeForm.value};
      if(this.editId == true) {
        let index = this.addEmployeeData.indexOf(this.addEmployeeData[this.editedIndexValue - 1]);
        this.addEmployeeData[index] = request;
      } else {
        this.countIndex += 1;
        request.index = this.countIndex;
        this.addEmployeeData.push(request);
        this.dummyFilteredData = this.addEmployeeData;
      }
      this.openEmployeesForm();
      this.getEmployeesDetails();
    } else {
       Object.keys(this.employeeForm.controls).forEach(key => {
      this.employeeForm.get(key).markAsDirty();
    });
    }
  }

  // edit employee dataSource
  editEmployeeData(element , index) {
    this.addForm = !this.addForm;
    this.editId = !this.editId;
    this.editedIndexValue = index;
    this.employeeForm.patchValue(element);
  }

  // delete the employee data
  deleteEmployeeData(element , index) {
    let filteredEmployees = this.addEmployeeData.filter((item) => item.index !== element.index);
    this.addEmployeeData = filteredEmployees;
    this.getEmployeesDetails();
  }

  // search employee data
  searchEmployeeData() {
    if(this.addEmployeeData && this.addEmployeeData.length >= 1) {
      let salary = this.searchForm.get('salaryAmount').value.toString();
      let department = this.searchForm.get('departmentWiseData').value;
      if(salary != '' || department != '') {
        if(salary != '') {
          let filteredEmployees = this.dummyFilteredData.filter(item => (item.salary.toString()).includes(salary));
          this.addEmployeeData = filteredEmployees;
          this.getEmployeesDetails();
        } 
        if(department != '') {
          let filteredEmployees = this.dummyFilteredData.filter(item => item.department !== null && 
          (item.department).toLowerCase().includes(department.toLowerCase()));
          this.addEmployeeData = filteredEmployees;
          this.getEmployeesDetails();
        }
      } else {
           alert('please select atLeast one value for filter...')
      }
    } else {
      alert('please add employee data first...')
    }
  }

  // clear employee data
  clearEmployeeData() {
   this.searchForm.patchValue({'salaryAmount': ''});
   this.searchForm.patchValue({'departmentWiseData' :''});
   this.addEmployeeData = this.dummyFilteredData;
   this.getEmployeesDetails();
  }
}


