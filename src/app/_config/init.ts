import { Injectable } from "@angular/core";
import { PermissionHelper } from "../helpers/permission.helper";
import { PermissionService } from "../services";
import { AutenticacaoService } from "../services/auth/autenticacao.service";
import { ConfiguracaoInicial, Menu } from "./models/_index";

@Injectable()
export class Init {
  configuracaoInicial: ConfiguracaoInicial;
  socials: Menu[] = [];
  menus: Menu[] = [];
  footerMenus: Menu[] = [];
  menusLogadoAdmin: Menu[] = [];

  get imageHandlle() {
    return this._autenticacaoService.imagem != null
      ? this._autenticacaoService.imagem
      : "assets/images/defaults/user.png";
  }

  constructor(
    private _autenticacaoService: AutenticacaoService,
    private _permissionService: PermissionService
  ) {
    this.IniciarConfiguracaoInicial();
    this.IniciarMenus();
    this.preencherMenuLogadoAdmin();
    this._autenticacaoService.atualizarImagemENomeUsuario.subscribe(() => {
      this.IniciarConfiguracaoInicial();
    });
  }

  IniciarMenus() {
    this.preencherSocialBase();
    this.preencherMenuBase();
    // this.preencherMenuLogadoAdmin();
  }

  IniciarConfiguracaoInicial() {
    this.configuracaoInicial = new ConfiguracaoInicial(
      "Black",
      "assets/images/logo-black-mk-241x189p.svg",
      "assets/images/logo-black-mk-241x189p.svg",
      "assets/images/logo-black-mk-241x189p.svg",
      this.imageHandlle
    );
  }

  preencherMenuLogadoAdmin() {
    this.menusLogadoAdmin.push(
      new Menu("Alterar senha", "lock", "alterar-senha")
    );
  }

  preencherSocialBase() {
    this.socials.push(
      new Menu("Facebook", "fab fa-facebook-f", "https://www.facebook.com")
    );
    this.socials.push(
      new Menu("Twitter", "fab fa-twitter", "https://www.twitter.com")
    );
    this.socials.push(
      new Menu("LinkedIn", "fab fa-linkedin-in", "https://www.linkedin.com")
    );
  }

  preencherFooterMenuBase() {
    this.footerMenus.push(new Menu("Sou profissional"));
    this.footerMenus.push(new Menu("Agendar uma consulta"));
    this.footerMenus.push(new Menu("Sou clínica"));
  }

  preencherMenuBase() {
    this.menus.push(new Menu("Início", "home", "dashboard"));
    this.menus.push(
      new Menu("Configurações", "settings", "", false, false, [
        new Menu("Perfil", "recent_actors", "configuracao/perfil"),
        new Menu(
          "Usuários",
          "manage_accounts",
          "configuracao/usuarios",
          false,
          false,
          null,
          "material-icons-outlined"
        ),
      ])
    );
    this.menus.push(
      new Menu("Financeiro", "attach_money", "", false, false, [
        new Menu("Gastos externos", "receipt", "financeiro/gastos-externos"),
        new Menu("Pagamentos diários", "paid", "financeiro/pagamento-diario"),
        new Menu("Controle de Compras", "inventory", "financeiro/controle-compras"),
        new Menu(
          "Formas de pagamento",
          "payments",
          "financeiro/forma-pagamento"
        ),
        new Menu("Fornecedor", "local_shipping", "financeiro/fornecedor"),
        new Menu("Categoria", "category", "financeiro/categoria"),
        // new Menu("Documentos", "post_add", "financeiro/documento"),
        new Menu("Pendências", "warning_amber", "financeiro/pendencias"),
        new Menu("Aplicativos", "apps", "financeiro/app"),
      ])
    );
    this.menus.push(
      new Menu("RH", "assignment_ind", "", false, false, [
        new Menu("Colaboradores", "person", "rh/colaboradores"),
      ])
    );
    this.menus.push(
      new Menu("Patrimônio", "account_balance", "", false, false, [
        new Menu("Patrimônios", "article", "patrimonio/patrimonios"),
        new Menu("Categoria de bens", "category", "patrimonio/categoria-bens"),
      ])
    );
    this.menus.push(
      new Menu("Premiação", "military_tech", "", false, false, [
       new Menu("Prêmios", "emoji_events", "premiacao/premios"),
       new Menu("Envios", "local_shipping", "premiacao/envio"),
       new Menu("Brindes", "card_giftcard", "premiacao/brinde"),
      ])
    );
    this.menus.push(new Menu("Alunos", "badge", "alunos"));
    this.menus.push(new Menu("Mentoria", "psychology", "mentoria"));
    this.menus.push(new Menu("Lançamentos", "event", "lancamentos"));
    this.menus.push(new Menu("Aulões", "school", "auloes"));
    this.menus.push(new Menu("Produtos", "inventory", "produtos"));

    var relatorios = [
      new Menu("Faturas Mentoria", "receipt", "relatorios/faturas-mentoria"),
      new Menu(
        "Contratos Mentoria",
        "pending_actions",
        "relatorios/contratos-mentoria",
      ),
      new Menu(
        "Gastos Externos",
        "receipt_long",
        "relatorios/gastos-externos",
      ),
    ];

    // Fazer uma lsita vazia, e ir dando push
    // var list = [];
    // if (this._permissionService.isValid(PermissionHelper.REPORT_INVOICE_VIEW_MENTORED))
    //   list.push(new Menu("Metas dos Agentes", "star_rate", "relatorios/metas"));

    // if (list.length > 0)
    //   this.menus.push(new Menu("Relatórios", "assignment", "", false, false, list));

    this.menus.push(
      new Menu("Relatórios", "assignment", "", false, false, relatorios)
    );
  }
}
