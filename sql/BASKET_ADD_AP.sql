create or replace procedure BASKET_ADD_SP(
P_PRODUCTID bb_basketitem.idproduct%TYPE,
P_PRICE bb_basketitem.price%TYPE,
P_QUANTITY bb_basketitem.quantity%TYPE,
P_BASKETID bb_basketitem.idbasket%TYPE,
P_SIZE BB_BASKETITEM.OPTION1%TYPE,
P_FORM BB_BASKETITEM.OPTION2%TYPE
)IS
BEGIN
INSERT INTO BB_BASKETITEM VALUES
(BB_IDBASKETITEM_SEQ.nextval,P_PRODUCTID,P_PRICE,P_QUANTITY,P_BASKETID,P_SIZE,P_FORM);
COMMIT;
END BASKET_ADD_SP;