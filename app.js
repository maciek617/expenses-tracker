const productListContainer = document.querySelector(
  '.expenses__container__list'
);
const filterInput = document.querySelector('.expenses__container__input');
const fromDateInput = document.querySelector('.from__date');
const toDateInput = document.querySelector('.to__date');
const form = document.querySelector('form');
const totalBox = document.querySelector('.total');
const sortBox = document.querySelector('.select_sort');
const selectIcon = document.querySelector('.select__icon');
const selectOptions = document.querySelector('.select__options');
const currentCategory = document.querySelector('.current__category');
const openFromDate = document.querySelector('#from_date_open');
const openToDate = document.querySelector('#to_date_open');
const currentFromDate = document.querySelector('.current__from__date');
const currentToDate = document.querySelector('.current__to__date');
const expensesFilterResetButton = document.querySelector('.expenses__reset');
const chartPeriod = document.getElementById('chartPeriod');
const chartCategory = document.getElementById('chartCategory');
const arrowRight = document.querySelector('.arrow_right');
const arrowLeft = document.querySelector('.arrow_left');
const arrowLeftEnd = document.querySelector('.arrow_end_left');
const arrowRightEnd = document.querySelector('.arrow_end_right');
const productsCount = document.querySelector('.product__count');
const allProducts = document.querySelector('.all_product__count');
const paginationCount = document.querySelector('.pagination__page__count');
const currentSelect = document.querySelector('.current__select');
const selectIconSort = document.querySelector('.select__sort__icon');
const openModal = document.querySelector('.open__modal');
const modal = document.querySelector('.modal__backdrop');
const closeModalIcon = document.querySelector('.modal__close');
const selectCategoryIcon = document.querySelector('.select__icon__category');
const selectCategoryItems = document.querySelector(
  '.select__category__options'
);
const modalProductDateElement = document.querySelector('#bought-date');
const modalProductDateInput = document.querySelector('.product__date');
const currentBoughtDate = document.querySelector('.current__bought__date');
const modalForm = document.querySelector('.modal__form');
const modalProductInput = document.querySelector('.modal__product__input');
const modalProductPriceInput = document.querySelector(
  '.modal__product__input__number'
);
const addProductButton = document.querySelector('.add__product');
const modalSelectedCategory = document.querySelector('.selected__category');
const errorFields = document.querySelectorAll('.error');
const noItemsFoundMsg = document.querySelector('.no__items__found');
const nav = document.querySelector('.nav__items');
const navIcons = document.querySelector('.nav__icons');
const openNavIcon = document.querySelector('.open__nav__icon');
const closeNavIcon = document.querySelector('.close__nav__icon');

//initial value
const productList = [
  { title: 'Coffe 1', price: 40, category: 'food', date: '2022-07-16' },
  { title: 'Bread 2', price: 8, category: 'food', date: '2022-07-23' },
  { title: 'Fuel 3', price: 320, category: 'car', date: '2022-08-16' },
  { title: 'Candies 4', price: 10, category: 'food', date: '2022-07-23' },
  { title: 'Brakes 5', price: 400, category: 'car', date: '2022-07-23' },
  { title: 'Coffe 6', price: 40, category: 'car', date: '2022-08-16' },
  { title: 'Coffe 7', price: 40, category: 'food', date: '2022-07-23' },
];
const monthNames = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

const filterObj = {
  text: '',
  category: '',
  fromDate: 0,
  toDate: 0,
};

let filteredElements = productList;
const availableCategories = ['food', 'car'];

const sortDictionary = {
  'Price: ascending': () => {
    filteredElements.sort((a, b) => a.price - b.price);
  },
  'Price: descending': () => {
    filteredElements.sort((a, b) => b.price - a.price);
  },
  'Date: ascending': () => {
    filteredElements.sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  'Date: descending': () => {
    filteredElements.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
};
let availableMonths = [];
let moneyPerMonth = {};
let moneyPerCategory = {};
let chartPerPeriod;
let chartPerCategory;
let availablePages = 0;
let currentPage = 0;

const filterElementsByText = () => {
  filterObj.text = filterInput.value.toLowerCase();
  filterElements();
};

const renderList = (products) => {
  products.forEach((product) => {
    let singleProduct = document.createElement('div');
    const singleProductHTML = `
            <p class="expenses_container__list__item__element">${product.title}</p>
            <p class="expenses_container__list__item__element">${product.price} PLN</p>
            <p class="expenses_container__list__item__element">${product.category}</p>
            <p class="expenses_container__list__item__element">${product.date}</p>`;

    singleProduct.innerHTML = singleProductHTML;
    singleProduct.classList.add('expenses_container__list__item');
    productListContainer.appendChild(singleProduct);
  });
};

const filterElements = () => {
  filteredElements = productList.filter((product) => {
    const productDate = new Date(product.date);
    if (
      filterObj.text &&
      filterObj.category &&
      filterObj.fromDate > 0 &&
      filterObj.toDate > 0
    ) {
      return (
        product.title.toLowerCase().includes(filterObj.text.toLowerCase()) &&
        product.category === filterObj.category &&
        filterObj.fromDate <= productDate.getTime() &&
        productDate.getTime() <= filterObj.toDate
      );
    } else if (
      filterObj.text &&
      filterObj.category &&
      filterObj.category !== 'all'
    ) {
      return (
        product.title.toLowerCase().includes(filterObj.text.toLowerCase()) &&
        product.category === filterObj.category
      );
    } else if (filterObj.text) {
      return product.title.toLowerCase().includes(filterObj.text.toLowerCase());
    } else if (filterObj.category && filterObj.category !== 'all') {
      return product.category === filterObj.category;
    } else if (filterObj.fromDate > 0 && filterObj.toDate > 0) {
      return (
        filterObj.fromDate <= productDate.getTime() &&
        productDate.getTime() <= filterObj.toDate
      );
    } else {
      return product;
    }
  });

  currentPage = 0;

  resetPagination();
  !filteredElements.length
    ? noItemsFoundMsg.classList.remove('hidden')
    : noItemsFoundMsg.classList.add('hidden');
};

const updateFilterObj = () => {
  const from = new Date(fromDateInput.value);
  const to = new Date(toDateInput.value);
  filterObj.text = filterInput.value.toLowerCase();

  filterObj.fromDate = from.getTime();
  filterObj.toDate = to.getTime();

  // update ui
  currentFromDate.textContent = fromDateInput.value || 'dd/mm/yyyy';
  currentToDate.textContent = toDateInput.value || 'dd/mm/yyyy';

  filterElements();
};

const countTotalPriceOfProducts = () => {
  let total = productList.reduce((a, b) => a + b.price, 0);
  totalBox.textContent = `Total: ${total} PLN`;
};

const sortProducts = (e) => {
  const target = e.target.textContent;
  sortDictionary[target]();
  productListContainer.innerHTML = '';
  currentSelect.textContent = target;
  showSortModal();
  resetPagination();
};

const getUniqueMonths = () => {
  for (let i = 0; i < productList.length; i++) {
    availableMonths.push(
      new Date(productList[i].date).toLocaleString('default', {
        month: 'short',
      })
    );
  }

  availableMonths = [...new Set(availableMonths)].sort((a, b) => {
    return monthNames[a] - monthNames[b];
  });
};

const setDeafultObjectValue = (arr) => {
  return arr.reduce((el, month) => {
    el[month] = 0;
    return el;
  }, {});
};

const sumMoneySpentEachMonth = () => {
  moneyPerMonth = { ...setDeafultObjectValue(availableMonths) };

  for (let i = 0; i < productList.length; i++) {
    const singleProdutMonth = new Date(productList[i].date).toLocaleString(
      'default',
      {
        month: 'short',
      }
    );

    moneyPerMonth[singleProdutMonth] += productList[i].price;
  }
};

const sumMoneySpentEachCategory = () => {
  moneyPerCategory = { ...setDeafultObjectValue(availableCategories) };

  for (let i = 0; i < productList.length; i++) {
    moneyPerCategory[productList[i].category] += productList[i].price;
  }
};

const toggleCategoryModal = () => {
  selectOptions.classList.toggle('hidden');
  selectIcon.classList.toggle('transformAnimation');
};

const filterElementsByCategory = (e) => {
  const value = e.target.textContent;
  filterObj.category = value;
  currentCategory.textContent = value;
  filterElements();

  selectOptions.classList.add('hidden');
};

const openInputDate = (input) => {
  input.showPicker();
};

const resetFilters = () => {
  filterObj.text = '';
  filterObj.category = '';
  filterObj.fromDate = 0;
  filterObj.toDate = 0;
  currentCategory.textContent = 'all';
  currentFromDate.textContent = 'dd/mm/yyyy';
  currentToDate.textContent = 'dd/mm/yyyy';
  filterInput.value = '';
  selectOptions.classList.add('hidden');
  filterElements();
};

const resetPagination = () => {
  productListContainer.innerHTML = '';
  paginationCount.textContent = currentPage + 1;
  pagination();
};

const nextPage = () => {
  if (filteredElements.length === +productsCount.textContent) return;
  currentPage++;
  resetPagination();
};

const prevPage = () => {
  if (currentPage <= 0) return;
  currentPage--;
  resetPagination();
};

const startPage = () => {
  currentPage = 0;
  resetPagination();
};

const endPage = () => {
  currentPage = availablePages;
  resetPagination();
};

const pagination = () => {
  availablePages = Math.round(filteredElements.length / 5);
  const productsPerView = currentPage * 5;

  const elementsToRender = filteredElements.slice(
    productsPerView,
    productsPerView + 5
  );
  renderList(elementsToRender);

  productsCount.textContent = productsPerView + elementsToRender.length;
  allProducts.textContent = filteredElements.length;
};

const showSortModal = () => {
  sortBox.classList.toggle('hidden');
};

const openModalProduct = () => {
  modal.classList.remove('hidden');
  modal.classList.add('modal__active');
  document.body.classList.add('block-scroll');
};

const closeModal = () => {
  modal.classList.add('hidden');
  modal.classList.remove('modal__active');
  document.body.classList.remove('block-scroll');
  modalProductInput.value = '';
  modalProductDateInput.value = '';
  modalProductPriceInput.value = '';
  currentBoughtDate.textContent = 'dd/mm/yyyy';
};

const closeModalOnEscape = (event) => {
  event.key === 'Escape' && closeModal();
};

const closeModalOnClickOutside = (event) => {
  event.target.classList.contains('modal__backdrop') && closeModal();
};

const showCategoryModalOptions = () => {
  selectCategoryItems.classList.toggle('hidden');
  selectCategoryIcon.classList.toggle('transformAnimation');
};

const updateModalUI = () => {
  currentBoughtDate.textContent = modalProductDateInput.value;
};

const addDataToChart = (chart, data, labels) => {
  chart.data.datasets[0].data = data;
  chart.data.labels = labels;
  chart.update();
};

const removeDataFromChart = (chart) => {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
};

const addNewProduct = (e) => {
  e.preventDefault();
  if (!modalProductInput.value) {
    errorFields[0].classList.remove('hidden');
    return;
  }
  if (
    !modalProductPriceInput.value ||
    parseFloat(modalProductPriceInput.value) < 1
  ) {
    errorFields[1].classList.remove('hidden');
    return;
  }

  if (!modalProductDateInput.value) {
    errorFields[0].classList.add('hidden');
    errorFields[1].classList.add('hidden');
    errorFields[2].classList.remove('hidden');
    return;
  }
  productList.push({
    title: modalProductInput.value,
    price: parseFloat(modalProductPriceInput.value),
    category: modalSelectedCategory.textContent,
    date: modalProductDateInput.value,
  });

  // Initial sort - reset
  sortDictionary['Date: descending']();

  resetPagination();
  getUniqueMonths();
  sumMoneySpentEachMonth();
  sumMoneySpentEachCategory();
  countTotalPriceOfProducts();
  resetFilters();
  removeDataFromChart(chartPerPeriod);
  addDataToChart(chartPerPeriod, Object.values(moneyPerMonth), availableMonths);
  addDataToChart(
    chartPerCategory,
    Object.values(moneyPerCategory),
    availableCategories
  );

  closeModal();

  // Reset errors
  errorFields.forEach((error) => error.classList.add('hidden'));
};

const updateModalCategory = (e) => {
  modalSelectedCategory.textContent = e.target.textContent;
  showCategoryModalOptions();
};

const toggleNav = () => {
  nav.classList.toggle('nav__active');
  openNavIcon.classList.toggle('hidden');
  closeNavIcon.classList.toggle('hidden');
  document.body.classList.toggle('block-scroll');
};

const init = () => {
  //Initial sort products
  sortDictionary['Date: descending']();

  pagination();
  getUniqueMonths();
  sumMoneySpentEachMonth();
  sumMoneySpentEachCategory();
  countTotalPriceOfProducts();

  chartPerPeriod = new Chart(chartPeriod, {
    type: 'line',
    data: {
      labels: availableMonths,
      datasets: [
        {
          label: 'Money spent in PLN',
          data: Object.values(moneyPerMonth),
          borderWidth: 1,
          backgroundColor: '#00ddc2',
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  chartPerCategory = new Chart(chartCategory, {
    type: 'bar',
    data: {
      labels: ['food', 'car'],
      datasets: [
        {
          label: 'Money spent in PLN',
          data: Object.values(moneyPerCategory),
          borderWidth: 1,
          backgroundColor: '#00ddc2',
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  expensesFilterResetButton.addEventListener('click', resetFilters);
  openFromDate.addEventListener('click', () => openInputDate(fromDateInput));
  openToDate.addEventListener('click', () => openInputDate(toDateInput));
  selectOptions.addEventListener('click', filterElementsByCategory);
  selectIcon.addEventListener('click', toggleCategoryModal);
  filterInput.addEventListener('input', filterElementsByText);
  form.addEventListener('change', updateFilterObj);
  sortBox.addEventListener('click', sortProducts);
  arrowRight.addEventListener('click', nextPage);
  arrowLeft.addEventListener('click', prevPage);
  arrowLeftEnd.addEventListener('click', startPage);
  arrowRightEnd.addEventListener('click', endPage);
  selectIconSort.addEventListener('click', showSortModal);
  openModal.addEventListener('click', openModalProduct);
  closeModalIcon.addEventListener('click', closeModal);
  selectCategoryIcon.addEventListener('click', showCategoryModalOptions);
  modalProductDateElement.addEventListener('click', () =>
    openInputDate(modalProductDateInput)
  );
  modalForm.addEventListener('change', updateModalUI);
  addProductButton.addEventListener('click', addNewProduct);
  selectCategoryItems.addEventListener('click', updateModalCategory);
  navIcons.addEventListener('click', toggleNav);
  window.addEventListener('keyup', closeModalOnEscape);
  window.addEventListener('click', closeModalOnClickOutside);
};

window.addEventListener('DOMContentLoaded', init);
