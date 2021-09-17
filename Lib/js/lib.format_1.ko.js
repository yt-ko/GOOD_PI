// formatCurrency for ko-KR.

(function($) {

	$.formatCurrency.regions['ko-KR'] = {
		symbol: '₩',
		positiveFormat: '%s%n',
		negativeFormat: '-%s%n',
		decimalSymbol: '.',
		digitGroupSymbol: ',',
		roundToDecimalPlace: 0,
		groupDigits: true
	};
	
	$.formatCurrency.regions['int'] = {
	    symbol: '',
	    positiveFormat: '%s%n',
	    negativeFormat: '-%s%n',
	    decimalSymbol: '.',
	    digitGroupSymbol: ',',
	    roundToDecimalPlace: 0,
	    groupDigits: true
	};
	
	$.formatCurrency.regions['float'] = {
	    symbol: '',
	    positiveFormat: '%s%n',
	    negativeFormat: '-%s%n',
	    decimalSymbol: '.',
	    digitGroupSymbol: ',',
	    roundToDecimalPlace: 2,
	    groupDigits: true
	};

	$.formatCurrency.regions['float1'] = {
	    symbol: '',
	    positiveFormat: '%s%n',
	    negativeFormat: '-%s%n',
	    decimalSymbol: '.',
	    digitGroupSymbol: ',',
	    roundToDecimalPlace: 1,
	    groupDigits: true
	};

	$.formatCurrency.regions['float4'] = {
	    symbol: '',
	    positiveFormat: '%s%n',
	    negativeFormat: '-%s%n',
	    decimalSymbol: '.',
	    digitGroupSymbol: ',',
	    roundToDecimalPlace: 4,
	    groupDigits: true
	};

	$.formatCurrency.regions['none'] = {
	    symbol: '',
	    positiveFormat: '%s%n',
	    negativeFormat: '-%s%n',
	    decimalSymbol: '.',
	    digitGroupSymbol: ',',
	    roundToDecimalPlace: 2,
	    groupDigits: true
	};

})(jQuery);
