const Modal = {
  open() {
    // Abrir Modal
    // Adicionar a class active ao modal
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    // Fechar o modal
    // Remover a class active do modal
    document.querySelector(".modal-overlay").classList.remove("active");
    Form.clearFields();
  },
  typeTransaction() {
    if (document.getElementById("radio-expenses").checked === true) {
      document.getElementById("amount").value = "-";
    } else if (document.getElementById("radio-incomes").checked === true) {
      document.getElementById("amount").value = "";
    } else {
      alert("Selecione um tipo de transação");
    }
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transaction) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transaction)
    );
  },
};

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },
  incomes() {
    let income = 0;
    // Pegar as transações
    /*for (let i = 0; i < Transaction.all.length; i++) {
      if (Transaction.all[i] > 0) {
        income += transaction.amount;
      }
    }*/
    Transaction.all.forEach((transaction) => {
      // Para cada transação, se for maior que 0
      if (transaction.amount > 0) {
        // Soma das transações
        income += transaction.amount;
      }
    });
    return income;
  },
  expense() {
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },
  total() {
    return Transaction.incomes() + Transaction.expense();
  },
};

const DOM = {
  transactionsContainer: document.querySelector(".transactions__table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? "data__income" : "data__expense";
    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
    <tr class="transactions__row">
      <td class="transactions__data data__description">${transaction.description}</td>
      <td class="${cssClass}">${amount}</td>
      <td class="transactions__data data__date">${transaction.date}</td>
      <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
    </tr>
    `;
    return html;
  },
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expense()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

// Formatação do Valor da Transação
const Utils = {
  formatDate(date) {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  formatAmount(value) {
    console.log(value);
    value = value * 100;
    return Math.round(value);
  },
  formatCurrency(value) {
    // Ternário pra verificar se o valor for < 0 recebe o sinal de negativo se não recebe nada
    const signal = Number(value) < 0 ? "-" : "";
    // Retira o sinal do valor
    value = String(value).replace(/\D/g, "");
    // Divide o valor por 100 pra formatar o valor do array para o valor real
    value = Number(value) / 100;
    // Formata o valor pra a moeda brasileira
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return signal + value;
  },
};

const Form = {
  expenses: document.getElementById("radio-expenses"),
  incomes: document.getElementById("radio-incomes"),
  description: document.getElementById("description"),
  amount: document.getElementById("amount"),
  date: document.getElementById("date"),
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },
  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date,
    };
  },
  validateFields() {
    //Desestruturação do objeto, retirando da função getValues
    const { description, amount, date } = Form.getValues();
    if (
      document.getElementById("radio-expenses").checked === false &&
      document.getElementById("radio-incomes").checked === false
    ) {
      throw new Error("Por favor, selecione o tipo de transação");
    }
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },
  clearFields() {
    Form.expenses.checked = false;
    Form.incomes.checked = false;
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
  submit(event) {
    event.preventDefault();
    try {
      // Validar os campos, verificando se estão preenchidos
      Form.validateFields();
      // Dados Formatados para salvar no array
      const transaction = Form.formatValues();
      //Salvar e recarrega a aplicação
      Transaction.add(transaction);
      // Limpar os campos
      Form.clearFields();
      //Fechar Modal
      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

$(function () {
  $("#amount").maskMoney({
    thousands: "",
    decimal: ".",
    allowNegative: true,
  });
});

const App = {
  init() {
    /* Outra forma, mais reduzida, passando a função como atalho.
     * Como a função não retorna nada é possivel escrever dessa forma
     //Transaction.all.forEach(DOM.addTransaction)
     */
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });
    DOM.updateBalance();

    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
