using System.Security.Cryptography;

namespace CMS.Backend.Services
{
    public static class PasswordHashService
    {
        private const string Algorithm = "PBKDF2-SHA256";
        private const int Iterations = 100000;
        private const int SaltSize = 16;
        private const int HashSize = 32;

        public static string HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                HashAlgorithmName.SHA256,
                HashSize);

            return $"{Algorithm}${Iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
        }

        public static string HashIfNeeded(string value)
        {
            return IsHashed(value) ? value : HashPassword(value);
        }

        public static bool NeedsRehash(string? storedHash)
        {
            return !IsHashed(storedHash);
        }

        public static bool VerifyPassword(string password, string? storedHash)
        {
            if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(storedHash))
            {
                return false;
            }

            if (!IsHashed(storedHash))
            {
                return CryptographicOperations.FixedTimeEquals(
                    System.Text.Encoding.UTF8.GetBytes(password),
                    System.Text.Encoding.UTF8.GetBytes(storedHash));
            }

            var parts = storedHash.Split('$');
            if (parts.Length != 4 || parts[0] != Algorithm)
            {
                return false;
            }

            if (!int.TryParse(parts[1], out var iterations))
            {
                return false;
            }

            try
            {
                var salt = Convert.FromBase64String(parts[2]);
                var expectedHash = Convert.FromBase64String(parts[3]);
                var actualHash = Rfc2898DeriveBytes.Pbkdf2(
                    password,
                    salt,
                    iterations,
                    HashAlgorithmName.SHA256,
                    expectedHash.Length);

                return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
            }
            catch (FormatException)
            {
                return false;
            }
        }

        private static bool IsHashed(string? value)
        {
            return !string.IsNullOrWhiteSpace(value) && value.StartsWith($"{Algorithm}$", StringComparison.Ordinal);
        }
    }
}
