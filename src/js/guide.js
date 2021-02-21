function startIntro() {
  var intro = introJs();
  intro.setOptions({
    nextLabel: "Próximo",
    prevLabel: "Anterior",
    doneLabel: "Pronto",
    tooltipClass: "customTooltip",
    steps: [
      {
        title: "Dashboard",
        element: document.querySelector(".balance"),
        intro:
          "Aqui você tem uma dashboard, onde irá visualizar a sua carteira de entrada, de saída e o total.",
      },
      {
        title: "Adicionar Transação",
        element: document.querySelector(".transactions__btn-new"),
        intro:
          "Para adicionar uma transação você deve clicar no botão 'Nova Transação'.",
      },
      {
        title: "Adicionar Despesa",
        element: document.querySelector("#radio-expenses"),
        intro:
          "Para adicionar uma despesa, selecione primeiramente o botão de despesa.",
        position: "left",
      },
      {
        title: "Adicionar Entrada",
        element: document.querySelector("#radio-incomes"),
        intro:
          "Para adicionar uma entrada, selecione primeiramente o botão de entrada.",
        position: "left",
      },
      {
        title: "Descrição",
        element: document.querySelector("#description"),
        intro:
          "Aqui você irá adicionar qual será a descrição da sua transação.",
        position: "top",
      },
      {
        title: "Valor",
        element: document.querySelector("#amount"),
        intro: "Aqui você irá adicionar qual o valor da sua transação.",
        position: "top",
      },
      {
        title: "Data",
        element: document.querySelector("#date"),
        intro: "E por ultimo você irá adicionar qual a data da sua transação.",
        position: "top",
      },
      {
        title: "Salvar Transação",
        element: document.querySelector(".button--save"),
        intro:
          "Depois de preencher todos os campos, basta você clicar no botão salvar para adicionar a sua transação.",
      },
    ],
  });
  $(".button--tour-accept").click(function () {
    $(".welcome-modal").hide();
    intro.start();
  });
  $(".button--tour-refuse").click(function () {
    $(".welcome-modal").hide();
  });
}
