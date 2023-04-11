import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStatusEnum } from 'src/app/enums/customer-status.enum';

@Injectable()
export class NavigationService {

  constructor(private _router: Router) {

  }

  publicPage() {
    this._router.navigate(['public']);
  }

  login() {
    this._router.navigate(['login']);
  }

  dashboard() {
    this._router.navigate(['dashboard']);
  }

  customers(status: CustomerStatusEnum = null) {
    if (status != null)
      this._router.navigate([`alunos?status=${status}`]);
    else
      this._router.navigate([`alunos`]);
  }

  customerNew(action: string = null) {
    if (action != null)
      this._router.navigate(["alunos/novo"], { queryParams: { acao: 'novo_aluno' } })
    else
      this._router.navigate([`alunos/novo`]);
  }

  customerEdit(id: number) {
    this._router.navigate([`alunos/${id}`]);
  }

  employeeList() {
    this._router.navigate(["rh/colaboradores"])
  }

  employeeNew() {
    this._router.navigate(["rh/colaboradores/novo"]);
  }

  employeeEdit(id: number) {
    this._router.navigate([`rh/colaboradores/${id}`]);
  }

  mentoreds(status: CustomerStatusEnum = null) {
    if (status != null)
      this._router.navigate([`mentoria?status=${status}`]);
    else
      this._router.navigate([`mentoria`]);
  }

  mentoredNew(action: string = null) {
    if (action != null)
      this._router.navigate(["mentoria/novo"], { queryParams: { acao: 'novo_mentorado' } })
    else
      this._router.navigate([`mentoria/novo`]);
  }

  mentoredEdit(id: number) {
    this._router.navigate([`mentoria/${id}`]);
  }

  lauchNew(action: string = null) {
    if (action != null)
      this._router.navigate(["lancamentos/novo"], { queryParams: { acao: 'lancamento_aluno' } })
    else
      this._router.navigate([`lancamentos/novo`]);
  }

  lauchList() {
    this._router.navigate([`lancamentos`]);
  }

  lauchEdit(id: number) {
    this._router.navigate([`lancamentos/${id}`]);
  }

  productList() {
    this._router.navigate([`produtos`]);
  }

  productEdit(id: number) {
    this._router.navigate([`produtos/${id}`]);
  }

  awardList() {
    this._router.navigate([`premios`]);
  }

  awardEdit(id: number) {
    this._router.navigate([`premios/${id}`]);
  }

  expenseList() {
    this._router.navigate([`financeiro/gastos-externos`]);
  }

  expenseNew() {
    this._router.navigate(["financeiro/gastos-externos/novo"]);
  }

  expenseEdit(id: number) {
    this._router.navigate([`financeiro/gastos-externos/${id}`]);
  }

  providerList() {
    this._router.navigate([`financeiro/fornecedor`]);
  }

  providerNew() {
    this._router.navigate(["financeiro/fornecedor/novo"]);
  }

  providerEdit(id: number) {
    this._router.navigate([`financeiro/fornecedor/${id}`]);
  }

  dailyPaymentList() {
    this._router.navigate([`financeiro/pagamento-diario`]);
  }

  dailyPaymentNew() {
    this._router.navigate(["financeiro/pagamento-diario/novo"]);
  }

  dailyPaymentEdit(id: number) {
    this._router.navigate([`financeiro/pagamento-diario/${id}`]);
  }

  purchaseControlList() {
    this._router.navigate(["financeiro/controle-compras"]);
  }

  purchaseControlNew() {
    this._router.navigate(["financeiro/controle-compras/novo"]);
  }

  purchaseControlEdit(id: number) {
    this._router.navigate([`financeiro/controle-compras/${id}`]);
  }

  patrimonyList() {
    this._router.navigate(["patrimonio/patrimonios"]);
  }

  patrimonyNew() {
    this._router.navigate(["patrimonio/patrimonios/novo"]);
  }

  patrimonyEdit(id: number) {
    this._router.navigate([`patrimonio/patrimonios/${id}`]);
  }

  pendencyList() {
    this._router.navigate(["financeiro/pendencias"]);
  }

  pendencyNew() {
    this._router.navigate(["financeiro/pendencia/novo"]);
  }

  pendencyEdit(id: number) {
    this._router.navigate([`financeiro/pendencia/${id}`]);
  }

  appList() {
    this._router.navigate(["financeiro/app"]);
  }

  appNew() {
    this._router.navigate(["financeiro/app/novo"]);
  }

  appEdit(id: number) {
    this._router.navigate([`financeiro/app/${id}`]);
  }

  sentList() {
    this._router.navigate(["premiacao/envio"]);
  }

  sentNew() {
    this._router.navigate(["premiacao/envio/novo"]);
  }

  sentEdit(id: number) {
    this._router.navigate([`premiacao/envio/${id}`]);
  }

  giftList() {
    this._router.navigate(["premiacao/brinde"]);
  }

  giftNew() {
    this._router.navigate(["premiacao/brinde/novo"]);
  }

  giftEdit(id: number) {
    this._router.navigate([`premiacao/brinde/${id}`]);
  }
}
