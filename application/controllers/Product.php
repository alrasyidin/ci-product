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
    // $this->load->library('form_validation');
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

  public function getDataById($id)
  {
    $result = $this->productModel->getById($id);
    echo json_encode($result);
  }

  public function select_validate($value){
      echo json_encode($value);
      if($value == 'none'){
        $this->form_validation->set_message('select_validate', 'Please select item');
        return false;
      } else {
        return true;
      }
  }

  public function store(){
    $product = $this->input->post();
    
    // $this->form_validation->set_rules('name', 'Name', 'required');
    // $this->form_validation->set_rules('description', 'Description', 'required');
    // $this->form_validation->set_rules('status', 'Status', 'required');
    // $this->form_validation->set_rules('category_id', 'Category', 'required');
    
    $product['slug'] = $this->slug->create_uri($product);
    
    // if ($this->form_validation->run() == TRUE){
      $result = $this->productModel->storeProduct($product);
      if($result){
        echo json_encode(['status' => 'success', 'message' => 'Store product succesfully', 'data' => $result]);
      }
    // }else {
    //   echo json_encode($this->form_validation);
    //   echo json_encode(['errors' => validation_errors()]);
    // }
  }
  
  public function delete(){
    $id = json_decode($this->input->post('ids'));
    
    $result = $this->productModel->deleteProduct($id);
    
    if($result){
      echo json_encode(['status' => 'success', 'message' => 'Record selected product deleted successfully']);
    } else {
      echo json_encode(['status' => 'success', 'message' => 'Record selected product failed to deleted, '.$result]);
    }
  }

  public function update($id){
      $product = $this->input->post();
      
      $result  = $this->productModel->updateProduct($product, $id);

      if($result){
        echo json_encode(['status' => 'success', 'message' => 'Record selected product deleted successfully']);
      } else {
        echo json_encode(['status' => 'success', 'message' => 'Record selected product deleted successfully, '.$result]);
      }
      
  }
}

/* End of file ProductController.php */
