using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.WindowsAzure.Storage.Table;

namespace SenzoDynamicService.Data.Provider
{
    public enum KeyType
    {
        PartitionKey = 0,

        RowKey = 1,
    }

    public class TableStorageProvider<TEntity> where TEntity : TableEntity, new()
    {
        /// <summary>
        /// Azure settings: connection, retry policies, etc.
        /// </summary>
        private readonly AzureSettings azureSettings = new AzureSettings();

        /// <summary>
        /// The cloud table we're manipulating
        /// </summary>
        private CloudTable CloudTable { get; set; }

        /// <summary>
        /// Initializes a new instances of the TableStorageProvider class.
        /// </summary>
        /// <param name="azureSettings">Azure connection settings.</param>
        /// <param name="tableName">The table to be manipulated.</param>
        public TableStorageProvider(string tableName)
        {
            var tableClient = this.azureSettings.StorageAccount.CreateCloudTableClient();

            // Create the table if it doesn't exist.
            this.CloudTable = tableClient.GetTableReference(tableName);
            this.CloudTable.CreateIfNotExists();
        }

        /// <summary>
        /// Inserts an entity into the table.
        /// </summary>
        /// <param name="data">The entity to be inserted.</param>
        public void Insert(TEntity data)
        {
            var insertOperation = TableOperation.Insert(data);
            this.ExecuteOperationWithRetry(insertOperation);
        }

        /// <summary>
        /// Bulk insert operation.
        /// </summary>
        /// <param name="entities">The entities to be inserted.</param>
        public void InsertBatch(IEnumerable<TEntity> entities)
        {
            var batchOperation = new TableBatchOperation();

            foreach (var entity in entities)
            {
                batchOperation.Insert(entity);
            }

            CloudTable.ExecuteBatch(batchOperation, new TableRequestOptions() { RetryPolicy = this.azureSettings.RetryPolicy });
        }

        /// <summary>
        /// Retrieves all the entities from the tables given a key.
        /// </summary>
        /// <param name="key">The key we're searching with.</param>
        /// <returns>The list of entities having the provided key.</returns>
        public List<TEntity> GetAll(string key, KeyType keyType)
        {
            var query = new TableQuery<TEntity>().Where(TableQuery.GenerateFilterCondition(keyType.ToString(), QueryComparisons.Equal, key));

            return CloudTable.ExecuteQuery(query, new TableRequestOptions() { RetryPolicy = this.azureSettings.RetryPolicy }).ToList();
        }



        /// <summary>
        /// Retrieves a single entity given the primary and row key.
        /// </summary>
        /// <param name="partitionKey">The primary key used for searching.</param>
        /// <param name="rowKey">The row key used for searching.</param>
        /// <returns>The entity if found, null otherwise.</returns>
        public TEntity GetSingle(string partitionKey, string rowKey)
        {
            var retrieveOperation = TableOperation.Retrieve<TEntity>(partitionKey, rowKey);
            var retrievedResult = this.ExecuteOperationWithRetry(retrieveOperation);

            TEntity result = null;
            
            if (retrievedResult.Result != null)
            {
                result = retrievedResult.Result as TEntity;
            }

            return result;
        }

        public void Update(string partitionKey, string rowKey, TEntity replacementEntity, Boolean insertOrReplace)
        {
            var retrieveOperation = TableOperation.Retrieve<TEntity>(partitionKey, rowKey);
            var retrievedResult = this.ExecuteOperationWithRetry(retrieveOperation);

            var updateEntity = retrievedResult.Result as TEntity;

            if (updateEntity != null)
            {
                replacementEntity.PartitionKey = updateEntity.PartitionKey;
                replacementEntity.RowKey = updateEntity.RowKey;

                TableOperation updateOperation;
                if (insertOrReplace)
                {
                    updateOperation = TableOperation.InsertOrReplace(replacementEntity);
                }
                else
                {
                    updateOperation = TableOperation.Replace(replacementEntity);
                }

                this.ExecuteOperationWithRetry(updateOperation);
            }
        }

        /// <summary>
        /// Deletes an entry in the table.
        /// </summary>
        /// <param name="partitionKey">Entity's partition key.</param>
        /// <param name="rowKey">Entity's row key.</param>
        public void DeleteEntry(string partitionKey, string rowKey)
        {
            var retrieveOperation = TableOperation.Retrieve<TEntity>(partitionKey, rowKey);
            var retrievedResult = this.ExecuteOperationWithRetry(retrieveOperation);

            var deleteEntity = retrievedResult.Result as TEntity;

            if (deleteEntity != null)
            {
                var deleteOperation = TableOperation.Delete(deleteEntity);

                this.ExecuteOperationWithRetry(deleteOperation);
            }
        }

        /// <summary>
        /// Deletes the table the provider is working with.
        /// </summary>
        public void DeleteTable()
        {
            if (CloudTable.DeleteIfExists(new TableRequestOptions() { RetryPolicy = this.azureSettings.RetryPolicy }))
            {
                //Logger.Info("Table {0} deleted", CloudTable.Name);
            }
        }

        /// <summary>
        /// Executes a table operation with retry logic.
        /// </summary>
        /// <param name="operation">The operation to be executed.</param>
        /// <returns>The operation's result.</returns>
        public TableResult ExecuteOperationWithRetry(TableOperation operation)
        {
            TableResult operationResult = null;

            try
            {
                TableRequestOptions requestOptions = new TableRequestOptions();
                requestOptions.RetryPolicy = this.azureSettings.RetryPolicy;

                operationResult = this.CloudTable.Execute(operation, requestOptions);
            }
            catch (Exception exc)
            {
                //Logger.Error("Failed to execute operation: {0} with error: {1}", operation, exc.ToString());
            }

            return operationResult;
        }
    }
}