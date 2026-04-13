/**
 * Custom JavaScript for SAKTI Analytics
 */

$(document).ready(function() {
    // Ambil judul dari atribut data- di tabel, atau gunakan default
    var dataTableElement = $('#dataTables');
    
    if (dataTableElement.length) {
        var exportTitle = dataTableElement.data('export-title') || 'Data Laporan';
        var exportFilename = dataTableElement.data('filename') || 'Export_File_' + new Date().getTime();
        var deleteText = $('.delete-form').data('text') || 'Yakin ingin menghapus?';

        var table = dataTableElement.DataTable({
            dom: '<"row mb-3 justify-content-between"' +
                '<"col-md-7 d-flex align-items-center gap-3"lB>' +
                '<"col-md-3 d-flex justify-content-end"f>' +
                '>rt' +
                '<"row mt-3"<"col-md-6"i><"col-md-6 d-flex justify-content-end"p>>',
            buttons: [{
                    extend: 'excelHtml5',
                    className: 'btn btn-sm btn-success',
                    text: '<i class="fas fa-file-excel"></i> Excel',
                    title: exportTitle,
                    filename: exportFilename
                },
                {
                    extend: 'pdfHtml5',
                    className: 'btn btn-sm btn-danger',
                    text: '<i class="fas fa-file-pdf"></i> PDF',
                    title: exportTitle,
                    filename: exportFilename
                },
                {
                    extend: 'print',
                    className: 'btn btn-sm btn-info',
                    text: '<i class="fas fa-print"></i> Print',
                    title: exportTitle
                }
            ],
            lengthMenu: [
                [5, 10, 25, 50, -1],
                [5, 10, 25, 50, "All"]
            ],
            pageLength: 5,
            ordering: true,
            searching: true,
            pagingType: 'full_numbers',
            language: {
                lengthMenu: "Tampilkan _MENU_ data per halaman",
                zeroRecords: "<div class='text-center w-100'>Tidak ada data ditemukan</div>",
                info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
                infoEmpty: "Tidak ada data tersedia",
                infoFiltered: "(difilter dari total _MAX_ data)",
                search: "Cari:",
                paginate: {
                    first: "<svg class='icon'><use xlink:href='/dist/vendors/@coreui/icons/svg/free.svg#cil-chevron-double-left'></use></svg>",
                    last: "<svg class='icon'><use xlink:href='/dist/vendors/@coreui/icons/svg/free.svg#cil-chevron-double-right'></use></svg>",
                    next: "<svg class='icon'><use xlink:href='/dist/vendors/@coreui/icons/svg/free.svg#cil-chevron-right'></use></svg>",
                    previous: "<svg class='icon'><use xlink:href='/dist/vendors/@coreui/icons/svg/free.svg#cil-chevron-left'></use></svg>"
                }
            }
        });

        // 🔥 Ubah wrapper dt-buttons jadi btn-group
        table.buttons().container()
            .addClass('btn-group')
            .removeClass('dt-buttons');

        // Checkbox "Select All" logic
        $(document).on('click', '#checkbox-all', function() {
            var isChecked = this.checked;
            table.rows({
                page: 'current'
            }).nodes().to$().find('.checkbox-item').prop('checked', isChecked);
            toggleBulkDeleteBtn();
        });

        $(document).on('change', '.checkbox-item', function() {
            var visibleCheckboxes = table.rows({
                page: 'current'
            }).nodes().to$().find('.checkbox-item');
            var checkedVisible = visibleCheckboxes.filter(':checked');

            $('#checkbox-all').prop('checked', visibleCheckboxes.length === checkedVisible.length);
            toggleBulkDeleteBtn();
        });

        function toggleBulkDeleteBtn() {
            var selectedCount = table.$('.checkbox-item:checked').length;
            if (selectedCount > 0) {
                $('#bulk-delete-form').show();
            } else {
                $('#bulk-delete-form').hide();
            }
        }

        // Bulk delete confirmation
        $(document).on('submit', '#bulk-delete-form', function(e) {
            e.preventDefault();
            var form = this;
            var checkedItems = table.$('input.checkbox-item:checked');
            var selectedCount = checkedItems.length;

            if (selectedCount === 0) {
                Swal.fire('Peringatan', 'Pilih data yang ingin dihapus', 'warning');
                return;
            }

            Swal.fire({
                title: 'Hapus ' + selectedCount + ' data terpilih?',
                text: "Data yang dipilih akan dihapus secara permanen!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, hapus semua!',
                cancelButtonText: 'Batal',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $(form).find('input[name="ids[]"]').remove();
                    checkedItems.each(function() {
                        $('<input>').attr({
                            type: 'hidden',
                            name: 'ids[]',
                            value: $(this).val()
                        }).appendTo(form);
                    });
                    form.submit();
                }
            });
        });
    }

    // Global SweetAlert2 for Delete Confirmation
    $(document).on('submit', '.delete-form', function(e) {
        e.preventDefault();
        var form = this;
        var deleteText = $(this).data('text') || 'Yakin ingin menghapus?';
        
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: deleteText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit();
            }
        });
    });
});

// Toast Notification Handler
document.addEventListener('DOMContentLoaded', function() {
    const handleToast = (id) => {
        const toastEl = document.getElementById(id);
        if (toastEl) {
            const toast = new coreui.Toast(toastEl, {
                delay: 3000,
                autohide: true
            });
            toast.show();
        }
    };

    ['toastInfo', 'toastSuccess', 'toastError'].forEach(handleToast);
});
