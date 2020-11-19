$(document).ready(function() {

    $('.calc-option-info-link, .calc-panel-btn a').click(function(e) {
        calcWindowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            calcWindowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('calc-window')) {
            calcWindowClose();
        }
    });

    $('body').on('click', '.calc-window-close, .calc-window-close-btn', function(e) {
        calcWindowClose();
        e.preventDefault();
    });

    $('.calc-option-input input').change(function() {
        calcUpdate();
    });

    calcUpdate();

    $('.calc-window-info-btn a').click(function(e) {
        var curID = $(this).parents().filter('.calc-window').attr('id');
        $('.calc-option-info-link[href="#' + curID + '"]').parent().find('input').prop('checked', true).trigger('change');
        calcWindowClose();
        e.preventDefault();
    });

    $('#installation-checkbox').change(function() {
        if ($('#installation-checkbox:checked').length == 1) {
            $('#installation-checkbox').prop('checked', false);
            calcWindowOpen('#calc-window-installation');
        } else {
            $('.calc-option-variant').html('');
        }
    });

    $('.calc-window-installation-item a').click(function(e) {
        var curItem = $(this);
        $('#installation-checkbox').attr('data-price', curItem.attr('data-price'));
        $('#installation-checkbox').attr('data-id', curItem.attr('data-id'));
        $('#installation-checkbox').prop('checked', true);
        $('.calc-option-variant').html('<div class="calc-option-variant-item">' + curItem.find('.calc-window-installation-item-title').html() + '<a href="#"><svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10.6667" y="0.500732" width="1.8856" height="15.0848" transform="rotate(45 10.6667 0.500732)" /><rect x="11.9998" y="11.166" width="1.8856" height="15.0848" transform="rotate(135 11.9998 11.166)" /></svg></a></div>');
        calcWindowClose();
        calcUpdate();
        e.preventDefault();
    });

    $('body').on('click', '.calc-option-variant-item a', function(e) {
        $('.calc-option-variant').html('');
        $('#installation-checkbox').removeAttr('checked');
        calcUpdate();
        e.preventDefault();
    });

    $('body').on('focus', '.calc-window-form-input input', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.calc-window-form-input input', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('body').on('change', '.calc-window-form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.calc-window-form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.calc-window-form-file-name span').html(curName);
            curField.find('.calc-window-form-file-name').addClass('visible');
        } else {
            curField.find('.calc-window-form-file-name').removeClass('visible');
            curField.find('.calc-window-form-file-name span').html('');
        }
    });

    $('.calc-window-form-file-name a').click(function(e) {
        var curField = $(this).parent().parent();
        curField.find('input').val('');
        curField.find('.calc-window-form-file-name').removeClass('visible');
        curField.find('.calc-window-form-file-name span').html('');
        e.preventDefault();
    });

    $('.calc-window-form-input input').attr('autocomplete', 'off');
    $('.calc-window-order form').validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            var formData = new FormData(form);

            if (curForm.find('[type=file]').length != 0) {
                var file = curForm.find('[type=file]')[0].files[0];
                formData.append('file', file);
            }

            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                processData: false,
                contentType: false,
                dataType: 'html',
                data: formData,
                cache: false
            }).done(function(html) {
                calcWindowClose();
                $('#calc-window-status .calc-window-order').html(html);
                calcWindowOpen('#calc-window-status');
            });
        }
    });

});

function calcWindowOpen(linkWindow) {
    var curScroll = $(window).scrollTop();
    var curPadding = $('body').width();
    $('html').addClass('calc-window-open');
    curPadding = $('body').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});
    $('.body_container').css({'top': -curScroll});
    $('.body_container').data('curScroll', curScroll);

    $(linkWindow).addClass('open');
}

function calcWindowClose() {
    if ($('.calc-window.open').length > 0) {
        $('.calc-window.open').removeClass('open');
        $('html').removeClass('calc-window-open');
        $('.body_container').css({'top': 0});
        $('body').css({'margin-right': 0});
        $(window).scrollTop($('.body_container').data('curScroll'));
    }
}

function calcUpdate() {
    var curSumm = 0;
    $('.calc-option-input input:checked').each(function() {
        curSumm += Number($(this).attr('data-price'));
    });
    $('.calc-panel-summ span').html(String(curSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));

    $('.calc-option-input input').each(function() {
        $('.calc-window-order-content input[name="order[\'' + $(this).attr('name') + '\']"]').val($(this).prop('checked'));
    });
    $('.calc-option-input input#installation-checkbox:checked').each(function() {
        $('.calc-window-order-content input[name="order[\'installationid\']"]').val($(this).attr('data-id'));
    });
}