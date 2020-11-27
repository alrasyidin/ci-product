<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Category_model extends CI_Model {
  public function insertRandomCategories($categories){
      return $this->db->insert_batch('categories', $categories);
  }

  public function getAllCategories(){
    return $this->db->get('categories')->result();
  }
}

/* End of file Category_model.php */
