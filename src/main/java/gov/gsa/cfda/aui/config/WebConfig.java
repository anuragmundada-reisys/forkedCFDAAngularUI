package gov.gsa.cfda.aui.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    /**
     * Maps all AngularJS routes to index so that they work with direct linking.
     */
    @Controller
    static class Routes {
        @RequestMapping({
                "/search",
                "/advanced-search",


                "/programs/add/",
                "/programs/add/{section:\\w+}",
                "/programs/{id:\\w+}/edit/{section:\\w+}",
                "/programs",
                "/programs/{list:\\w+}/{filter:\\w+}",
                "/programs/{id:\\w+}/view",
                "/programs/{id:\\w+}/preview",
                "/programs/{id:\\w+}/review",


                "/requests/{id:\\w+}/view",

                
                "/historicalIndex",
                "/historicalIndex/{list:\\w+}/{filter:\\w+}",
                "/historicalIndex/{hid:\\w+}/view/{pid:\\w+}",
                "/historicalIndex/{hid:\\w+}/edit/{pid:\\w+}",


                "/agency/main",
                "/agency/edit/{id:\\w+}",
                "/agency/review/{id:\\w+}",
                "/agency/create",


                "/myRegionalOffice",
                "/myRegionalOffice/create",
                "/myRegionalOffice/{id:\\w+}/edit",
                "/myRegionalOffice/{id:\\w+}/view",

                "/regionalOffice",
                "/regionalOffice/{id:\\w+}/view",


                "/organization",
                "/organization/{id:\\w+}/edit",
                "/organization/{id:\\w+}/view",


                "/users",
                "/users/{id:\\w+}/edit",
                "/users/{id:\\w+}/view",


                "/unauthorized",
                "/forbidden",

        })
        public String index() {
            return "forward:/index.html";
        }
    }
}