class Paginacion {
  constructor(amountRecords) {
    this.currentPageNumber = 1; //default
    this.offset = 0;
    this.limit = parseInt(process.env.LIMIT_PAGINATION);
    this.amountRecords = amountRecords;
    this.amountPages = Math.ceil(this.amountRecords / this.limit);
  }

  getLimit() {
    return this.limit;
  }

  getAmountOfPages() {
    return this.amountPages;
  }

  getOffset() {
    return this.offset;
  }

  setCurrentPage(numberPage) {
    this.currentPageNumber = numberPage;
    this.calculateOffset();
  }

  calculateOffset() {
    return (this.offset = this.currentPageNumber * this.limit - this.limit);
  }

  validateNumOfPage() {
    const regularExpresion = /^[0-9]$/;

    return regularExpresion.test(this.currentPageNumber);
  }
}

export default Paginacion;
