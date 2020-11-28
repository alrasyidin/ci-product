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

	function showAllProduct() {
		// $('#loading').hide();
		$.ajax({
			url: `${window.base_url}/product/getData`,
			type: "ajax",
			async: true,
			dataType: "json",
			beforeSend: function () {
				let loader = `
					<div class="wrapperLoading">
					<div class="my-5">
						<i class="fas fa-circle-notch fa-spin fa-5x"></i>
					</div>
					</div>
				`;
				$("body").prepend(loader);
			},
			complete: function () {
				$(".wrapperLoading").remove();

				// load data table
				$("#dataTable").DataTable()

				$(".item-record").click(function(e){
					$(e.currentTarget).find('.deleteCheckbox').each((id, item) => item.checked = !item.checked)
				})
			},
			success: function (response) {
				let products = response.data.products;
				let categories = response.data.categories;
				let htmlRaw = "";

				let id = 0;
				products.forEach((product) => {
					htmlRaw += `
						<tr class="item-record">
							<td>
							<div class="custom-control custom-checkbox">
									<input class="custom-control-input deleteCheckbox" id="product-checked-${product.id}" type="checkbox" title="Check this item" id="checkAll" data-id="${product.id}">
									<label class="custom-control-label" for="product-checked-${product.id}"></label>
							</div>
							</td>
              <td>${++id}</td>
              <td>${product.id + '.' + firstLetterCapital(product.name)}</td>
              <td>${
								product.description.split(" ").length > 7
									? product.description.split(" ").slice(0, 10).join(" ") +
									  "..."
									: firstLetterCapital(product.description)
							} </td>
							<td>${firstLetterCapital(product.category)}</td>
							
              <td>${
								product.status == true
									? '<span class="badge badge-primary">Active</span>'
									: '<span class="badge badge-danger">Non Active</span>'
							}</td>
              <td>${getDateFormatID(product.created_at)}</td>
              <td class="d-flex">
                <button id="${ product.id }" class="btn btn-warning btn-sm product-edit">EDIT</button>
              </td>
            </tr>
          `;
				});

				let categoryOption = ""

				categories.forEach((category) => {
					categoryOption += `
						<option value="${category.id}">${category.name}</option>
					`
				})
				
				$("#show_data").html(htmlRaw);

				
				$("#category").append(categoryOption);
			},
		});
	}

	function update(){

	}

	function store(){
		ajax(`${window.base_url}/product/store`, data, function (response) {
			let data = JSON.parse(response);

			if (data.status == "success") {
				showAllProduct()
			}
		});
	}
	
	// display all product with ajax
	showAllProduct();

	// add item to record using modal
	$("#productAddOrEdit").submit(function (e) {
		e.preventDefault();
		let data = new FormData();
		let form = e.target.elements;

		data.append("name", $(form["name"]).val());
		data.append("status", $(form["status"]).val());
		data.append("description", $(form["description"]).val());
		data.append("category_id", $(form["category_id"]).val());

		cleanFormValue(form);
		$("#modalProduct").modal("hide");
	});

	// check all record if clicked
	$('#checkAll').on('click', function(e) {
		if(e.currentTarget.checked){
			$('.deleteCheckbox').each(function(index, item){
				item.checked = true
			})
		} else {
			$('.deleteCheckbox').each(function(index, item){
				item.checked = false
			})
		}
	})
	
	// delete item selected using checkbox
	$("#deleteCheckedRecord").click(function (e) {
		let itemsCheckbox = Array.from($('.deleteCheckbox:checked'))
		let isAnyChecked = itemsCheckbox.some(function(item) {
				return item.checked
		})

		if(isAnyChecked){
			if (confirm(`Are you sure delete ${itemsCheckbox.length} item`)) {
				let ids = itemsCheckbox.map(function(item) {
					return $(item).data('id')
				})

				
				let data = new FormData();
				data.append(`ids`, JSON.stringify(ids));

				ajax(`${window.base_url}/product/delete`, data, function (response) {
					
					// refresh 
					showAllProduct();
					// $('#dataTable').DataTable().rows($('.deleteCheckbox:checked').parents('tr')).remove().draw()
					
				});
			} else {
				console.log("cancel");
			}
		} else {
			alert('Please check any item record')
		}
	});

	// edit data to ui
	setTimeout(function(){
		$('.product-edit').on('click', function(e){
			e.preventDefault()
			e.stopPropagation()
			let id = $(e.target).data('id')

			let form =  $('#productAddOrEdit')[0].elements

			$.ajax({
				url: `${window.base_url}/product/getDataById`,
				data: {id: id},
				type: 'ajax',
				async: true,
				dataType: "json",
				success: function(response){
					console.log(response)
					$(form.name).val(response.name)
					$(form.description).val(response.description)
					$(form.status).val(response.status)
					$(form.category_id).val(response.category_id)

					$('#modalProduct').modal('show')
					$('#exampleModalLabel').text('Update Product')
					$('#btnSaveOrUpdate').text('Update')
				}
			})
		})
	}, 1000)

	$('#btnCreate').on('click', function(){
		$('#exampleModalLabel').text('Create a Product')
		$('#btnSaveOrUpdate').text('Save')

		$('#modalProduct').modal('show')
	})

	$('#modalCancel,.close').on('click', function(e){
		let form =  $('#productAddOrEdit')[0].elements
		cleanFormValue(form)

		$('#modalProduct').modal('hide')
	})
});
