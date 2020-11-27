<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Seeder extends CI_Controller {
  public function __construct(){
    // date_default_timezone_set('Asia/Jakarta');

    parent::__construct();

    include APPPATH . 'third_party/faker/src/autoload.php';
    $this->faker = Faker\Factory::create();

    $this->load->model('Category_model', 'categoryModel');
    $this->load->model('Product_model', 'productModel');

    $config = array(
      'table' => 'products',
      'field' => 'slug',
      'title' => 'name',
    );
    $this->load->library('slug', $config);
  }

  public function categories()
  {
    $categories = [];

    for ($i=0; $i < 10; $i++) { 
      $categories[$i]['name'] = $this->faker->words(rand(1, 2), true);
    }

    // print_r($categories);
    // die();
    
    $save = $this->categoryModel->insertRandomCategories($categories);
    if ($save) {
      echo 'berhasil save data';
    } else {
      echo 'gagal save data';
    }
  }

  public function products()
  {
    $categories = $this->categoryModel->getAllCategories();

    if(count($categories) > 0){
      $product = [];
      
      foreach ($categories as $category) {
        $count = rand(1, count($categories));
        
        for ($i=0; $i < $count; $i++) { 
          $product = [
            'name' => $this->faker->words(rand(4, 7), true),
            'description' => $this->faker->paragraphs(rand(5, 10), true),
            'category_id' => $category->id,
          ];
          $product['slug'] = $this->slug->create_uri($product);

          $this->productModel->insertRandomProducts($product);
        }
      }
    } else {
      echo 'harap lakukan seeder untuk kategori terlebih dahulu';
    }
  }

}

/* End of file SeederController.php */
