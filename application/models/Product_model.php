<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_model extends CI_Model {
  public function insertRandomProducts($product){
    return $this->db->insert('products', $product);
  }

  public function getAllProducts(){
    $this->db->select('p.name,p.status,p.slug,p.description,p.created_at,c.name as category');
    $this->db->from('products as p');
    $this->db->join('categories as c', 'c.id = p.category_id');
    return $this->db->get()->result();
  }
}

/* End of file ModelName.php */
