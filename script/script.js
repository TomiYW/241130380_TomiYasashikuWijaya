$(document).ready(function () {
  let promoApplied = false;
  const promoCode = "PAEDI10";
  const discountRate = 0.10;

  function updateProductSubtotal(product) {
    const qty = parseInt(product.find('.count').text());
    const basePrice = parseFloat(product.data('base'));
    const newPrice = qty * basePrice;
    product.find('.price').text(`$${Math.round(newPrice)}`);
  }

  function showOrderItems() {
    let rows = "";
    $('.product').each(function () {
      const name = $(this).find('h3').text();
      const qty = parseInt($(this).find('.count').text());
      const subtotal = parseFloat($(this).find('.price').text().replace('$', ''));
      if (qty > 0) {
        rows += `
          <tr>
            <td>${name}</td>
            <td style="text-align: center;">${qty}</td>
            <td style="text-align: right;">$${Math.round(subtotal)}</td>
          </tr>`;
      }
    });
    $('#orderItems tbody').html(rows);
  }

  function calculateTotal() {
    let total = 0;
    $('.product').each(function () {
      const price = parseFloat($(this).find('.price').text().replace('$', ''));
      total += price;
    });

    if (promoApplied) {
      const discount = total * discountRate;
      const grandTotal = total - discount;
      $('#discount').text(Math.round(discount));
      $('#grandTotal').text(Math.round(grandTotal));
    } else {
      $('#discount').text('0');
      $('#grandTotal').text(Math.round(total));
    }

    $('#total').text(Math.round(total));
    $('.total, #invoice').show();
    showOrderItems();
  }

  $('.increase').click(function () {
    const product = $(this).closest('.product');
    let countEl = product.find('.count');
    countEl.text(parseInt(countEl.text()) + 1);
    updateProductSubtotal(product);
    calculateTotal();
  });

  $('.decrease').click(function () {
    const product = $(this).closest('.product');
    let countEl = product.find('.count');
    let count = parseInt(countEl.text());
    if (count > 1) {
      countEl.text(count - 1);
      updateProductSubtotal(product);
      calculateTotal();
    }
  });

  $('#orderForm').submit(function (e) {
    e.preventDefault();
    const inputCode = $('input[name="promo"]').val().trim();
    promoApplied = (inputCode.toUpperCase() === promoCode);
    if (promoApplied) {
      alert("Promo code applied! 10% discount diberikan.");
    }
    calculateTotal();
  });

  $('#orderForm').on('reset', function () {
    promoApplied = false;
    setTimeout(() => {
      $('.product').each(function () {
        $(this).find('.count').text(1);
        const basePrice = parseFloat($(this).data('base'));
        $(this).find('.price').text(`$${Math.round(basePrice)}`);
      });
      $('#orderItems tbody').empty();
      $('#total').text('0');
      $('#discount').text('0');
      $('#grandTotal').text('0');
      $('.total, #invoice').hide();
    }, 100);
  });

  // Inisialisasi base price dari isi awal
  $('.product').each(function () {
    const initialPrice = parseFloat($(this).find('.price').text().replace('$', ''));
    $(this).attr('data-base', (initialPrice / parseInt($(this).find('.count').text())).toFixed(2));
  });

  $('.total, #invoice').hide();
});