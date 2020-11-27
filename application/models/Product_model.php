<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_model extends CI_Model {
  public function insertRandomProducts($product){
    return $this->db->insert('products', $product);
}
}

/* End of file ModelName.php */
