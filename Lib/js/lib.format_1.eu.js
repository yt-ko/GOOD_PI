// formatCurrency for eu-ES.

(function($) {

	$.formatCurrency.regions['eu-ES'] = {
		symbol: '€',
		positiveFormat: '%n %s',
		negativeFormat: '-%n %s',
		decimalSymbol: ',',
		digitGroupSymbol: '.',
		groupDigits: true
	};

})(jQuery);
