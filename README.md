public List<T> getListDataBySqlQuery(String sqlQuery,
                                    Map<String, Object> parameters,
                                    int page, int pageSize,
                                    Class<T> mappedClass, Boolean isPaging,
                                    String sortName, String sortType) {
    if(isPaging) {
        // Oracle
        // sqlQuery = " SELECT * FROM ( "
        // 		+ " SELECT * FROM ( SELECT a.*, rownum indexRow FROM ( "
        // 		+ sqlQuery 
        // 		+ " ) a WHERE rownum < ((:p_page_number * :p_page_length) + 1 )) WHERE indexRow >= (((:p_page_number-1) * :p_page_length) + 1) "
        // 		+ " ) T_TABLE_NAME, "
        // 		+ " ( SELECT COUNT(*) totalRow FROM ( "
        // 		+ sqlQuery
        // 		+ " ) T_TABLE_TOTAL ) T_TABLE_NAME_TOTAL ";
        // parameters.put("p_page_number", page);
        // parameters.put("p_page_length", pageSize);
        // MySql
        int limit = pageSize;
        int offset = page * pageSize;
        sqlQuery = " SELECT * FROM "
            + " (( "
            + sqlQuery 
            + " ) T_TABLE_NAME, "
            + " ( SELECT COUNT(*) totalRow FROM ( "
            + sqlQuery
            + " ) T_TABLE_TOTAL ) T_TABLE_NAME_TOTAL ) ";
        if(sortName != null) {
            sqlQuery = sqlQuery + " ORDER BY " + sortName + " " + sortType;
        }
        sqlQuery = sqlQuery + " LIMIT " + limit + " OFFSET " + offset;
    }
    List<T> list = getNamedParameterJdbcTemplate().query(sqlQuery, parameters, BeanPropertyRowMapper.newInstance(mappedClass));
    return list;
}





@Override
public Datatable search(ObjectUsersDto objectUsersDto) {
    Datatable dataReturn = new Datatable();
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomOAuth2Request oAuth2Request = (CustomOAuth2Request) ((OAuth2Authentication) authentication).getOAuth2Request();
        CustomUserDetail customUserDetail = oAuth2Request.getCustomUserDetail();
        
        String sqlQuery = SQLBuilder.getSqlQueryById(SQLBuilder.SQL_MODULE_EMPLOYEES, "get-data-table-user");
        
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getFullName())){
            sqlQuery += " AND (LOWER(emp.first_name || emp.last_name) LIKE :fullName)";
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getUsername())){
            sqlQuery += " AND (LOWER(us.username) LIKE :username)";
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getEmail())){
            sqlQuery += " AND (LOWER(emp.email) LIKE :email)";
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getEmployeeCode())){
            sqlQuery += " AND (LOWER(emp.employee_code) LIKE :employeeCode)";
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getCreatedUser())){
            sqlQuery += " AND (LOWER(us.created_user) LIKE :createdUser)";
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getEnabledString())){
            sqlQuery += " AND us.enabled = :enabledString";
        }
        
        Map<String, Object> parameters = new HashMap<>();
        
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getFullName())){
            parameters.put("fullName", StringUtils.convertLowerParamContains(objectUsersDto.getFullName()));
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getUsername())){
            parameters.put("username", StringUtils.convertLowerParamContains(objectUsersDto.getUsername()));
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getEmail())){
            parameters.put("email", StringUtils.convertLowerParamContains(objectUsersDto.getEmail()));
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getEmployeeCode())){
            parameters.put("employeeCode", StringUtils.convertLowerParamContains(objectUsersDto.getEmployeeCode()));
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getCreatedUser())){
            parameters.put("createdUser", StringUtils.convertLowerParamContains(objectUsersDto.getCreatedUser()));
        }
        if (StringUtils.isNotNullOrEmpty(objectUsersDto.getEnabledString())){
            if("1".equals(objectUsersDto.getEnabledString())) {
                parameters.put("enabledString", true);
            } else if("0".equals(objectUsersDto.getEnabledString())) {
                parameters.put("enabledString", false);
            }
        }
        
        List<ObjectUsersDto> list = getListDataBySqlQuery(sqlQuery, parameters,
            objectUsersDto.getPage(), objectUsersDto.getPageSize(),
            ObjectUsersDto.class, true,
            objectUsersDto.getSortName(), objectUsersDto.getSortType());
        
        int count = 0;
        if(list.isEmpty()) {
            dataReturn.setTotal(count);
        } else {
            count = list.get(0).getTotalRow();
            dataReturn.setTotal(list.get(0).getTotalRow());
        }
        if (objectUsersDto.getPageSize() > 0){
            if (count % objectUsersDto.getPageSize() == 0){
                dataReturn.setPages(count / objectUsersDto.getPageSize());
            }
            else {
                dataReturn.setPages((count / objectUsersDto.getPageSize()) + 1);
            }
        }

        dataReturn.setData(list);
    } catch (Exception ex) {
        LOGGER.error(ex.getMessage(), ex);
    }

    return dataReturn;
}