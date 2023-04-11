import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MentoredAwardModel } from "src/app/models/mentored-award.model";
import { environment } from "src/environments/environment";

@Injectable()
export class MentoredAwardService {
    private endpoint: string = "mentoreds";

    constructor(
        private http: HttpClient
    ) { }

    findAwardByMentored(id: number): Observable<MentoredAwardModel[]> {
        return this.http.get<MentoredAwardModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/award`);
    }

    findAwardByMentoredById(mentoredId: number, id: number): Observable<MentoredAwardModel[]> {
        return this.http.get<MentoredAwardModel[]>(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/award/${id}`);
    }

    save(model: MentoredAwardModel): Observable<MentoredAwardModel> {
        if (model.id != null && model.id > 0)
            return this.put(model.id, model);
        else
            return this.post(model);
    }

    put(id: number, model: MentoredAwardModel): Observable<MentoredAwardModel> {
        return this.http.put<MentoredAwardModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/award/${id}`, model);
    }

    post(model: MentoredAwardModel): Observable<MentoredAwardModel> {
        return this.http.post<MentoredAwardModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/award/`, model);
    }

    remove(id: number, mentoredId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/award/${id}`);
    }

}