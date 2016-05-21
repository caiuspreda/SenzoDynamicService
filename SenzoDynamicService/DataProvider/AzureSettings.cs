using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using System;
using System.Configuration;

namespace SenzoDynamicService.Data.Provider
{
    /// <summary>
    /// Azure settings
    /// </summary>
    public class AzureSettings
    {
        /// <summary>
        /// Default time to wait between retries of a table storage operation in case it fails
        /// </summary>
        public TimeSpan RetryPolicyWaitTime
        {
            get
            {
                return TimeSpan.FromSeconds(10);
            }
        }

        /// <summary>
        /// Default maximum number of retries for a table storage operation.
        /// </summary>
        public int MaxNoOfRetries
        {
            get
            {
                return 5;
            }
        }

        /// <summary>
        /// Retry policy for table storage operations.
        /// </summary>
        public LinearRetry RetryPolicy { get; set; }

        /// <summary>
        /// The Azure storage account.
        /// </summary>
        public CloudStorageAccount StorageAccount { get; set; }

        public AzureSettings()
        {
            this.StorageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

            this.RetryPolicy = new LinearRetry(this.RetryPolicyWaitTime, this.MaxNoOfRetries);
        }
    }
}
