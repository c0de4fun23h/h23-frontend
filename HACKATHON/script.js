    util.on('#modal-id','click',()=>{
        UIkit.modal("#modal-id.uk-open".show());
    });
    util.of('#modal-id','click',()=> {
        UIkit.modal("#modal-id.uk-open".hide());
    })
        $(document).ready(function() {
            // Завантаження списку платежів при завантаженні сторінки
            loadPaymentList();

            // Додавання або оновлення платежу
            $('#paymentForm').submit(function(e) {
                e.preventDefault();

                var paymentId = $('#paymentId').val();
                var paymentData = {
                    id: paymentId ? parseInt(paymentId) : null,
                    type: $('#type').val(),
                    cardNumber: $('#cardNumber').val(),
                    expiryDate: $('#expiryDate').val(),
                    transactionId: parseInt($('#transactionId').val())
                };

                if (paymentId) {
                    updatePayment(paymentData);
                } else {
                    createPayment(paymentData);
                }
            });

            // Очищення форми при натисканні кнопки "Cancel"
            $('#cancelButton').click(function() {
                resetForm();
            });
        });
        // Завантаження списку платежів
        function loadPaymentList() {
            $.ajax({
                url: '/payments',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    renderPaymentList(data);
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }

        // Рендеринг списку платежів
        function renderPaymentList(data) {
            var paymentTableBody = $('#paymentTableBody');
            paymentTableBody.empty();

            data.forEach(function(payment) {
                var row = '<tr>' +
                            '<td>' + payment.id + '</td>' +
                            '<td>' + payment.type + '</td>' +
                            '<td>' + payment.cardNumber + '</td>' +
                            '<td>' + payment.expiryDate + '</td>' +
                            '<td>' + payment.transactionId + '</td>' +
                            '<td>' +
                                '<button type="button" class="btn btn-primary btn-sm mr-2" onclick="editPayment(' + payment.id + ')">Edit</button>' +
                                '<button type="button" class="btn btn-danger btn-sm" onclick="deletePayment(' + payment.id + ')">Delete</button>' +
                            '</td>' +
                        '</tr>';

                paymentTableBody.append(row);
            });
        }

        // Створення платежу
        function createPayment(paymentData) {
            $.ajax({
                url: '/payments',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(paymentData),
                success: function() {
                    resetForm();
                    loadPaymentList();
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }

        // Оновлення платежу
        function updatePayment(paymentData) {
            $.ajax({
                url: '/payments/' + paymentData.id,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(paymentData),
                success: function() {
                    resetForm();
                    loadPaymentList();
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }

        // Видалення платежу
        function deletePayment(paymentId) {
            if (confirm('Are you sure you want to delete this payment?')) {
                $.ajax({
                    url: '/payments/' + paymentId,
                    type: 'DELETE',
                    success: function() {
                        loadPaymentList();
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            }
        }

        // Заповнення форми для редагування платежу
        function editPayment(paymentId) {
            $.ajax({
                url: '/payments/' + paymentId,
                type: 'GET',
                dataType: 'json',
                success: function(payment) {
                    $('#paymentId').val(payment.id);
                    $('#type').val(payment.type);
                    $('#cardNumber').val(payment.cardNumber);
                    $('#expiryDate').val(payment.expiryDate);
                    $('#transactionId').val(payment.transactionId);
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }

        // Очищення форми
        function resetForm() {
            $('#paymentId').val('');
            $('#type').val('');
            $('#cardNumber').val('');
            $('#expiryDate').val('');
            $('#transactionId').val('');
        }

