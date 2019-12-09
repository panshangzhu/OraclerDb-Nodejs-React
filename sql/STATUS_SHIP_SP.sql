create or replace procedure STATUS_SHIP_SP(
P_BASKETID BB_BASKETSTATUS.IDBASKET%TYPE,
P_DATE bb_basketstatus.dtstage%TYPE,
P_SHIPPER bb_basketstatus.shipper%TYPE,
P_SHIPNUM bb_basketstatus.shippingnum%TYPE
)
IS
BEGIN
  INSERT INTO bb_basketstatus (idstatus, idbasket, idstage, dtstage,
                               shipper, shippingnum)
  VALUES (bb_status_seq.NEXTVAL, p_basketid, 3, p_date, p_shipper,
          p_shipnum);
  COMMIT;
END;
