<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Product extends CI_Controller {
  public function __construct(){
    parent::__construct();

    $this->load->model('Product_model', 'productModel');
  }

  public function index()
  {
    $products = $this->productModel->getAllProducts();
    // echo '<pre>';
    // var_dump($products);
    // die();
    $this->load->view('product/index.php', ['products' => $products]);
  }
}

/* End of file ProductController.php */
