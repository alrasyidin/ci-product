<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_model extends CI_Model {
  public function insertRandomProducts($product){
    return $this->db->insert('products', $product);
  }
  
  public function getQuery(){
    $this->db->select('p.id,p.name,p.status,p.slug,p.description,p.created_at,c.name as category');
    $this->db->from('products as p');
    $this->db->join('categories as c', 'c.id = p.category_id');
    // $this->db->order_by('p.id', 'DESC');
  }
  
  public function getAllProducts(){
    $this->getQuery();
    return $this->db->get()->result();
  }

  public function getById($id){
      $this->db->where('id', $id);
      return $this->db->get('products')->result()[0];
  }

  public function storeProduct($data){
    $save = $this->db->insert('products', $data);
    if($save){
      $id = $this->db->insert_id();
      $this->getQuery();
      $this->db->where('p.id', $id);
      return $this->db->get()->result()[0];
    } else {
      return null;
    }
  }

  public function deleteProduct($ids){
    if(!empty($ids)){
      $this->db->where_in('id', $ids);
      return $this->db->delete('products');
      // $this->db->last_query();
    }else {
      return 'Ids data is empty';
    }
  }

  public function updateProduct($data, $id){
      $this->db->where('id', $id);
      return $this->db->update('products', $data);
  }
}

/* End of file ModelName.php */
