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

	function showAllProduct() {
		// $('#loading').hide();
		$.ajax({
			url: `${window.base_url}/product/getData`,
			type: "ajax",
			async: true,
			dataType: "json",
			beforeSend: function(){
				let loader = `
					<div class="wrapperLoading">
					<div class="my-5">
						<i class="fas fa-circle-notch fa-spin fa-5x"></i>
					</div>
					</div>
				`;
				$("body").prepend(loader);
			},
			complete: function(){
				$(".wrapperLoading").remove()
			},
			success: function (response) {
				let products = response.data.products;
				let htmlRaw = "";

				products.forEach((product) => {
					htmlRaw += `
            <tr>
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td width="25">${
								product.description.split(" ").length > 7
									? product.description.split(" ").slice(0, 10).join(" ") +
									  "..."
									: product.description
							} </td>
              <td>${product.category}</td>
              <td>${product.status}</td>
              <td>${product.created_at}</td>
              <td class="d-flex">
                <button class="btn btn-danger btn-sm product-delete mr-2" data-id="${
									product.id
								}">DELETE</button>
                <button id="${
									product.id
								}" class="btn btn-warning btn-sm product-edit">EDIT</button>
              </td>
            </tr>
          `;
				});

				$("#show_data").html(htmlRaw);
			},
		});
	}

	showAllProduct();

	$("#productAdd").submit(function (e) {
		e.preventDefault();
		let data = new FormData();
		let form = e.target.elements;

		data.append("name", $(form["name"]).val());
		data.append("status", $(form["status"]).val());
		data.append("description", $(form["description"]).val());
		data.append("category_id", $(form["category_id"]).val());

		ajax(`${window.base_url}/product/store`, data, function (response) {
			if (response.status === "success") {
				console.log(response);
				alert(response.message);
			}
		});

		cleanFormValue(form);
		$("#modalProduct").modal("hide");
	});

	$(".product-delete").click(function (e) {
		if (confirm("Are you sure delete this item")) {
			let id = $(this).data("id");
			let data = new FormData();
			data.append("id", id);

			ajax(`${window.base_url}/product/delete`, data, function (response) {
				console.log(response);
			});
		} else {
			console.log("cancel");
		}
	});
});
