CREATE Event
    `create_table_auto_month_event` 
ON SCHEDULE EVERY
    1 MONTH                         
STARTS
    '2024-09-30 14:50:00'           
ON COMPLETION
    PRESERVE ENABLE                 
DO
    CALL create_table_auto_month(); 