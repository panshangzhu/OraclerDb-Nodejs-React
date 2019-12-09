DECLARE
   CURSOR cur_basket(p_id bb_basketitem.idBasket%type) IS
     SELECT bi.idBasket, bi.quantity, p.stock
       FROM bb_basketitem bi INNER JOIN bb_product p
         USING (idProduct)
       WHERE bi.idBasket = p_id;
  
   lv_flag_txt CHAR(1) := 'Y';
BEGIN
   FOR rec_basket IN cur_basket(6)
   LOOP 
      IF rec_basket.stock < rec_basket.quantity THEN lv_flag_txt := 'N'; END IF;
   END LOOP;
   IF lv_flag_txt = 'Y' THEN DBMS_OUTPUT.PUT_LINE('All items in stock!'); END IF;
   IF lv_flag_txt = 'N' THEN DBMS_OUTPUT.PUT_LINE('All items NOT in stock!'); END IF;   
END;
