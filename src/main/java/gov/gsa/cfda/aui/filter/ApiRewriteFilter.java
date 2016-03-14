package gov.gsa.cfda.aui.filter;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ApiRewriteFilter implements Filter {
    public static final String API_PROGRAMS_ENV = "pub.api.programs";
    public static final String API_SEARCH_ENV = "pub.api.search";
    public static Map<String, String> MAPPING;

    @Resource
    private Environment environment;

    @Override
    public void init(FilterConfig config) throws ServletException {
        if (MAPPING == null) {
            MAPPING = new HashMap<>();
            MAPPING.put("/api/eligibilitylistings", this.getEligibilitylistingsApiUrl());
            MAPPING.put("/api/listingcount", this.getListingCountApiUrl());
            MAPPING.put("/api/programs", this.getProgramsApiUrl());
            MAPPING.put("/api/programRequests", this.getProgramRequestsApiUrl());
            MAPPING.put("/api/programRequestActions", this.getProgramRequestActionsApiUrl());
            MAPPING.put("/api/regionalAgencies", this.getRegionalAgencyApiUrl());
            MAPPING.put("/api/contacts", this.getContactsApiUrl());
            MAPPING.put("/api/dictionaries", this.getDictionaryApiUrl());
            MAPPING.put("/api/search", this.getSearchApiUrl());
        }
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        String requestURI = request.getRequestURI();
        boolean redirected = false;

        for (Map.Entry<String, String> entry : MAPPING.entrySet()) {
            String pattern = "(.*)".concat(entry.getKey()).concat("(.*)");
            if (requestURI.matches(pattern)) {
                //  TODO Handle Redirect
            }
        }

        if (!redirected) {
            chain.doFilter(req, res);
        }
    }

    @Override
    public void destroy() {
        //  No destruction required
    }

    private String getProgramRequestsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programRequests";
    }

    private String getProgramRequestActionsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programRequestActions";
    }

    private String getProgramsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs";
    }

    private String getRegionalAgencyApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalAgency";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contacts";
    }

    private String getEligibilitylistingsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs/listings/eligibility";
    }

    private String getListingCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs/listings";
    }

    private String getDictionaryApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/dictionaries";
    }

    private String getSearchApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/search";
    }
}