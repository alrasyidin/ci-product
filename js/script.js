$(document).ready(function () {
	function ajax(url, data, callback, method) {
		$.ajax({
			url: url,
			data: data,
			type: method || "post",
			// dataType: 'json',
			processData: false,
			contentType: false,
			cache: false,
			success: callback,
		});
	}

	function cleanFormValue(form) {
		$(form["name"]).val("");
		$(form["status"]).val("");
		$(form["description"]).val("");
		$(form["category_id"]).val("");
	}
	function firstLetterCapital(word) {
		return word[0].toUpperCase() + word.slice(1);
	}

	function getDateFormatID(date) {
		let dateStr = new Date(date);
		return new Intl.DateTimeFormat("id-ID").format(dateStr);
	}

	// edit data to ui
	function editState() {
		$(".product-edit").on("click", function (e) {
			e.stopPropagation();

			let id = $(e.target).data("id");
			console.log(id);
			console.log(e.target);

			let form = $("#productAddOrEdit")[0].elements;

			$.ajax({
				url: `${window.base_url}/product/getDataById/${id}`,
				type: "ajax",
				async: true,
				dataType: "json",
				success: function (response) {
					$(form.name).val(response.name);
					$(form.description).val(response.description);
					$(form.status).val(response.status);
					$(form.category_id).val(response.category_id);
					$(form.id).val(response.id);

					$("#modalProduct").modal("show");
					$("#exampleModalLabel").text("Update Product");
					$("#btnSaveOrUpdate").text("Update");
				},
			});
		});
	}

	function showAllProduct() {
		$("#dataTable").DataTable({
			processing: true,
			// serverSide: true,
			order: [[1, "desc"]],
			ajax: {
				url: `${window.base_url}/product/getData`,
				type: "get",
				dataSrc: function ({ data, message, status }) {
					let categoryOption = "";

					data.categories.forEach((category) => {
						categoryOption += `
							<option value="${category.id}">${category.name}</option>
						`;
					});

					$("#category").append(categoryOption);

					return data.products;
				},
				complete: function () {
					editState();
				},
			},
			columns: [
				{
					data: "id",
					render: function (data) {
						return `<div class="custom-control custom-checkbox">
																<input class="custom-control-input deleteCheckbox" id="product-checked-${data}" type="checkbox" title="Check this item" id="checkAll" data-id="${data}">
																<label class="custom-control-label" for="product-checked-${data}"></label>
														</div>`;
					},
				},
				{
					data: "id",
				},
				{
					data: "name",
				},
				{
					data: "description",
					render: function (data) {
						return data.split(" ").length > 7
							? data.split(" ").slice(0, 10).join(" ") + "..."
							: firstLetterCapital(data);
					},
				},
				{
					data: "category",
				},
				{
					data: "status",
					render: function (data) {
						return data == true
							? '<span class="badge badge-primary">Active</span>'
							: '<span class="badge badge-danger">Non Active</span>';
					},
				},
				{
					data: "created_at",
					render: function (data) {
						return getDateFormatID(data);
					},
				},
				{
					data: "id",
					render: function (data) {
						return `<button data-id="${data}" class="btn btn-warning btn-sm product-edit">EDIT</button>`;
					},
				},
			],
		});
	}

	function update(data, id) {
		ajax(`${window.base_url}/product/update/${id}`, data, function (response) {
			let data = JSON.parse(response);

			if (data.status == "success") {
				$("#dataTable").DataTable().ajax.reload();

				alert(data.message);
			}
		});
	}

	function store(data) {
		ajax(`${window.base_url}/product/store`, data, function (response) {
			let data = JSON.parse(response);

			if (data.status == "success") {
				$("#dataTable").DataTable().ajax.reload();

				alert(data.message);
			}
		});
	}

	// display all product with ajax
	showAllProduct();

	// add item to record using modal
	$("#productAddOrEdit").submit(function (e) {
		e.preventDefault();
		window.validator = $(e.target).validate({
			rules: {
				name: {
					required: true,
				},
				description: {
					required: true,
				},
				status: {
					required: true,
				},
				category_id: {
					required: true,
				},
			},
			messages: {
				name: {
					required: "Name is required",
				},
				description: {
					required: "Description is required",
				},
				status: {
					required: "Status is required",
				},
				category_id: {
					required: "Category is required",
				},
			},
			submitHandler: function (form) {
				form = form.elements;

				let data = new FormData();
				data.append("name", $(form.name).val());
				data.append("status", $(form.status).val());
				data.append("description", $(form.description).val());
				data.append("category_id", $(form.category_id).val());

				if ($(e.target).find("#btnSaveOrUpdate").text() == "Save") {
					store(data);
				} else {
					let id = $(form.id).val();

					update(data, id);
				}

				cleanFormValue(form);
				$("#modalProduct").modal("hide");
			},
		});
	});

	// check all record if clicked
	$("#checkAll").on("click", function (e) {
		if (e.currentTarget.checked) {
			$(".deleteCheckbox").each(function (index, item) {
				item.checked = true;
			});
		} else {
			$(".deleteCheckbox").each(function (index, item) {
				item.checked = false;
			});
		}
	});

	// delete item selected using checkbox
	$("#deleteCheckedRecord").click(function (e) {
		let itemsCheckbox = Array.from($(".deleteCheckbox:checked"));
		let isAnyChecked = itemsCheckbox.some(function (item) {
			return item.checked;
		});

		if (isAnyChecked) {
			if (confirm(`Are you sure delete ${itemsCheckbox.length} item`)) {
				let ids = itemsCheckbox.map(function (item) {
					return $(item).data("id");
				});

				let data = new FormData();
				data.append(`ids`, JSON.stringify(ids));

				ajax(`${window.base_url}/product/delete`, data, function (response) {
					response = JSON.parse(response);
					// refresh
					$("#checkAll").get(0).checked = false;
					$("#dataTable").DataTable().ajax.reload();

					alert(response.message);
				});
			} else {
				console.log("cancel");
			}
		} else {
			alert("Please check any item record");
		}
	});

	// edit data to ui

	$("#btnCreate").on("click", function () {
		$("#exampleModalLabel").text("Create a Product");
		$("#btnSaveOrUpdate").text("Save");

		$("#modalProduct").modal("show");
	});

	$("#modalCancel,.close").on("click", function (e) {
		let form = $("#productAddOrEdit")[0].elements;
		cleanFormValue(form)
		
		window.validator.resetForm()

		$("#modalProduct").modal("hide");
	});
});
