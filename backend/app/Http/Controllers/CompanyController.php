<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyProfileResource;
use App\Models\Company;

class CompanyController extends Controller
{
    public function show(Company $company): CompanyProfileResource
    {
        return new CompanyProfileResource($company);
    }
}
