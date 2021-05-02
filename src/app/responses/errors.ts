
const Err = {
    /* Account Authorization Erros */
    InvalidPhoneNumber: 'AA01',
    TokenValidataionFailed: 'AA10',

    /* Server Errors */
    InternalServerError: 'SE01',
    DatabaseError: 'SE11',

    /* Authorization Errors */
    InvalidCredentials: 1100,
    InvalidLoginEmail: 1110,
    InvalidLoginPassword: 1120,
    InactiveUser: 1130,
    TermsAndConditionsNotAccepted: 1140,
    TokenValidationFailed: 1200,
    LimitedAccess: 1300,
    MissingAuthToken: 1400,
  
    /* Extended Limited access error */
    NodeNotAccessible: 1311,
    InvalidAccessibleNodes: 1312, // While assigning accessible nodes to user.
  
    /* Name already exists */
    EmailAlreadyExists: 2110,
    OrganizatinAlreadyExists: 2210,
    SiteAlreadyExists: 2310,
    SubsiteAlreadyExists: 2410,
    SolutionAlreadyExists: 2510,
    FeatureAlreadyExists: 2610,
  
    /* User Conflicts */
    DuplicateInvite: 2111,
    RepeatedPassword: 2112,
    IncorrectCurrPassword: 2113,
  
    /* Bad Request */
    ValidationFailed: 3400,
    EmptyRequestBody: 3500,
    MissingParentId: 3510,
    InvalidContentType: 3600,
    RouteNotFound: 3700,
    DuplicateRequest: 3800,
    InvalidHierarchy: 3900,
    InvalidSubSiteHierarchy: 3910,
    InvalidSiteHierarchy: 3920,
    UserNotFound: 2000,
  
    /* Undefined Code */
    UndefinedCode: 9999,
  };
  export default Err