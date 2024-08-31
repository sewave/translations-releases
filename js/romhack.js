function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function getUrlParam(parameter, defaultvalue) {
	var urlparameter = defaultvalue;
	if (window.location.href.indexOf(parameter) > -1) {
		urlparameter = getUrlVars()[parameter];
	}
	return urlparameter;
}
var images = [];

function completeToHtmlStars(completeData) {
	complete = '';
	for(var i = 0; i < completeData; i++) {
		complete = complete + '<img src="images/star.png" />'; 
	}
	return complete;
}

function loadHackData(data) {
	$('#hackName').html(data.name);
	$('#hackAltName').html(data.altName);
	$('#hackGenre').html(data.genre);
	$('#hackSystem').html(data.system);
	$('#hackDate').html();
	$('#hackNotes').html(data.notes);


	$('#hackComplete').html(completeToHtmlStars(data.complete));

	$('#hackVersion').html(
		"<a href=\"" + data.path + "/" + data.patchFilename + "?rnd=" + new Date().getTime() + "\">" + data.version + "</a>");
	$('#hackReadme').html("<a target=\"_blank\" href=\"" + data.path + "/" + data.readmeFilename + "?rnd=" + new Date().getTime() + "\">Descargar</a>");
	$('#hackRom').html(data.romDesc);
	$('#hackImageTitle').attr("src", "");
	$('#hackImageTitle').attr("src", data.path + '/' + data.imagesFilenames[0]);
	images = [];
	for (var i = 0; i < data.imagesFilenames.length; i++) {
		images.push(data.path + '/' + data.imagesFilenames[i]);
	}
}

function documentReady() {
	tableData.push(...tableData2);
	$('#translations').DataTable({
		"lengthMenu": [
			[10, 25, 100, 1000, 9999],
			[10, 25, 100, 1000, 9999]
		],
		"processing": true,
		"data": tableData,
		"language": spanishLang,
		"lengthChange": true,
		"responsive": true,
		"order": [
			[0, "desc"]
		],
		"columns": [{
				"data": "id",
				"visible": false
			},
			{
				"data": "altName",
				"visible": false
			},
			{
				"data": "name"
			},
			{
				"data": "system"
			},
			{
				"data": "genre"
			},
			{
				"data": "complete",
				"render" : function( data , type , row ) {
					if ( type === "sort" )
						return data;
					return completeToHtmlStars(data);

				}
			},
			{
				"data": "releaseDate"
			},
			{
				"data": "version"
			},
			{
				"data": null,
				"defaultContent": "<a href=\"#\" class=\"view\">Ver</a>",
				"orderable": "false"
			}
		],
		initComplete: function () {
            this.api()
                .columns('.selectSearch')
                .every(function () {
                    var column = this;
                    var select = $('<select><option value=""></option></select>')
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());
 
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });
 
                    column
                        .data()
                        .unique()
                        .sort()
                        .each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        });
                });
        },
	});
	var table = $('#translations').DataTable();
	$('#translations tbody').on('click', 'a.view', function () {
		loadHackData(table.row(this.parentNode).data());
		$('#entryModal1').modal({
			fadeDuration: 250
		});
	});
	var search = getUrlParam('search', '')
	if (search != '') {
		table.search(search).draw();
	}
	$("#hackGallery, #hackImageTitle").click(function () {
		Fresco.show(images, {
			thumbnails: 'vertical',
		});
	});
}

