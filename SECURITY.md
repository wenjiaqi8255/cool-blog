# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------- |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The Cool Blog team takes security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Do NOT** open a public issue about security vulnerabilities.

Instead, please send an email to: **security@example.com** (replace with actual contact)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if known)

### What to Expect

1. **Acknowledgment** - We'll respond within 48 hours
2. **Investigation** - We'll investigate and validate the report
3. **Resolution** - We'll work on a fix and keep you updated
4. **Disclosure** - We'll coordinate disclosure with you

### Response Time

- **Critical** - Response within 24 hours, patch within 7 days
- **High** - Response within 48 hours, patch within 14 days
- **Medium** - Response within 72 hours, patch within 30 days
- **Low** - Response within 1 week, patch in next release

## Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use environment variables
   - Add sensitive files to `.gitignore`
   - Rotate exposed keys immediately

2. **Validate input**
   - Validate all user input
   - Sanitize data from external sources
   - Use parameterized queries for database

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

4. **Use HTTPS**
   - All deployments use HTTPS
   - Configure redirect from HTTP to HTTPS

### For Users

1. **Environment Variables**
   - Never share your `.env` files
   - Rotate API keys periodically
   - Use strong, unique passwords

2. **Database Access**
   - Restrict database access by IP
   - Use SSL connections
   - Regular backups

3. **MCP Server**
   - Keep MCP_API_KEY secret
   - Rotate keys if compromised
   - Monitor access logs

## Security Features

Cool Blog includes several security features:

- **SQL Injection Prevention** - Parameterized queries via Drizzle ORM
- **XSS Prevention** - DOMPurify sanitization for user content
- **CSRF Protection** - Built-in token validation
- **Input Validation** - Zod schema validation
- **Type Safety** - Full TypeScript coverage
- **Dependency Monitoring** - Automated security audits

## Dependency Security

### Automated Checks

We use npm audit to check for vulnerabilities:

```bash
npm audit
npm audit fix
```

### Vulnerability Disclosure

When vulnerabilities are found in dependencies:
1. Evaluate severity and impact
2. Update to patched version
3. Test thoroughly
4. Release security update

## Security Audits

Periodic security audits are performed:
- Code review for common vulnerabilities
- Dependency scans
- Configuration checks
- Access control validation

## Additional Resources

- [Astro Security](https://docs.astro.build/en/guides/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Neon Security](https://neon.tech/docs/security)

## Contact

For security questions or concerns:
- **Email**: security@example.com (replace with actual contact)
- **GitHub**: Use "Report a vulnerability" option

Thank you for helping keep Cool Blog secure! 🔒
