import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PermissionModel, ProfileModel } from "src/app/models";

@Injectable()
export class ProfileService {

	constructor(
		private http: HttpClient,
	) { }

	get(): Observable<ProfileModel[]> {
		return this.http.get<ProfileModel[]>(
			`${environment.urlApiResource}/profiles`,
		);
	}

	find(id: number): Observable<ProfileModel> {
		return this.http.get<ProfileModel>(
			`${environment.urlApiResource}/profiles/${id}`,
		);
	}

	save(model: ProfileModel): Observable<ProfileModel> {
		if (model.id != null && model.id > 0)
			return this.put(model);
		else
			return this.post(model);
	}

	put(model: ProfileModel): Observable<ProfileModel> {
		return this.http.put<ProfileModel>(
			`${environment.urlApiResource}/profiles`, model
		);
	}

	post(model: ProfileModel): Observable<ProfileModel> {
		return this.http.post<ProfileModel>(
			`${environment.urlApiResource}/profiles`, model
		);
	}

	getPermissions(): Observable<PermissionModel[]> {
		return this.http.get<PermissionModel[]>(
			`${environment.urlApiResource}/profiles/permissions`,
		);
	}

}
