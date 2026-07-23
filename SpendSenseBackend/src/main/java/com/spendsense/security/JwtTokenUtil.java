package com.spendsense.security;

import com.spendsense.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;

@Component
public class JwtTokenUtil {

    @Value("${app.name:SpendSense}")
    private String APP_NAME;

    @Value("${jwt.secret:someSecretKeyThatIsVeryLongAndSecureForSpendSenseApp123!}")
    private String SECRET;

    @Value("${jwt.expires_in:1800000}")
    private int EXPIRES_IN;

    @Value("Authorization")
    private String AUTH_HEADER;

    private final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS512;

    public String generateToken(User user) {
        return Jwts.builder()
                .setIssuer(APP_NAME)
                .setSubject(user.getUsername())
                .claim("role", user.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(generateExpirationDate())
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS512).compact();
    }

    private Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + EXPIRES_IN);
    }

    public String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    public String getUsernameFromToken(String token) {
        try {
            final Claims claims = this.getAllClaimsFromToken(token);
            return claims.getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public Date getIssuedAtDateFromToken(String token) {
        try {
            final Claims claims = this.getAllClaimsFromToken(token);
            return claims.getIssuedAt();
        } catch (Exception e) {
            return null;
        }
    }

    public Date getExpirationDateFromToken(String token) {
        try {
            final Claims claims = this.getAllClaimsFromToken(token);
            return claims.getExpiration();
        } catch (Exception e) {
            return null;
        }
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}