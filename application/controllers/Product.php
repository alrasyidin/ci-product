<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Product extends CI_Controller {
  public function __construct(){
    parent::__construct();

    $this->load->model('Product_model', 'productModel');
    $this->load->model('Category_model', 'categoryModel');

    $config = array(
      'table' => 'products',
      'field' => 'slug',
      'title' => 'name',
    );
    $this->load->library('slug', $config);
  }
  public function index(){
    $this->load->view('product/index.php');
  }
  public function getData()
  {
    $products = $this->productModel->getAllProducts();
    $categories = $this->categoryModel->getAllCategories();

    echo json_encode(['status' => 'success', 'message' => 'Store product succesfully', 'data' => ['products' => $products, 'categories' => $categories]]);
    
  }

  public function store(){
    $product = $this->input->post();
    $product['slug'] = $this->slug->create_uri($product);
    
    $result = $this->productModel->storeProduct($product);
    
    if($result){
      echo json_encode(['status' => 'success', 'message' => 'Store product succesfully', 'data' => $result]);
    }
  }
  
  public function delete(){
    $id = $this->input->post('id');
    
    $result = $this->productModel->deleteProduct($id);
  
    if($result){
      echo json_encode(['status' => 'success', 'message' => 'This product deleted successfully']);
    }
  }
}

/* End of file ProductController.php */
